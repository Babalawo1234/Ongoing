'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserGroupIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/app/components/ui/StatCard';
import Breadcrumb from '@/app/components/ui/Breadcrumb';
import LoadingSkeleton from '@/app/components/ui/LoadingSkeleton';
import { db } from '@/app/lib/normalizedDatabase';
import type { Course as DBCourse } from '@/app/lib/normalizedDatabase';

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  status: string;
  completed: boolean;
  grade: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  yearOfStudy?: string;
  course?: string;
}

export default function AcademicDashboard() {
  const router = useRouter();
  const [systemCourses, setSystemCourses] = useState<DBCourse[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);

  useEffect(() => {
    // Load courses from normalized database (system courses)
    const allCourses = db.getCourses();
    setSystemCourses(allCourses);

    // Load students from localStorage
    const savedUsers = localStorage.getItem('aun_checksheet_users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      const studentUsers = allUsers.filter((u: any) => u.role === 'student');
      setStudents(studentUsers);
      
      // Calculate total enrollments and completions across all students
      let enrollments = 0;
      let completions = 0;
      
      studentUsers.forEach((student: any) => {
        const userCoursesKey = `user_courses_${student.id}`;
        const savedCourses = localStorage.getItem(userCoursesKey);
        if (savedCourses) {
          const courses = JSON.parse(savedCourses);
          enrollments += courses.length;
          
          // Count completed courses (those with grades)
          const storedGrades = localStorage.getItem('student_grades');
          if (storedGrades) {
            const allGrades = JSON.parse(storedGrades);
            const studentGrades = allGrades.filter((g: any) => g.studentId === student.id);
            completions += studentGrades.length;
          }
        }
      });
      
      setTotalEnrollments(enrollments);
      setTotalCompletions(completions);
    }
    
    setLoading(false);
  }, []);

  const stats = {
    totalStudents: students.length,
    totalCourses: systemCourses.length, // Courses in the system
    totalEnrollments: totalEnrollments, // Total course enrollments
    totalCompletions: totalCompletions, // Total completed courses
    averageCompletion: totalEnrollments > 0 
      ? Math.round((totalCompletions / totalEnrollments) * 100)
      : 0,
  };

  const recentStudents = students.slice(0, 5);
  
  // Group system courses by level
  const coursesByLevel = {
    '100': systemCourses.filter(c => {
      const code = c.course_code || '';
      const num = parseInt(code.match(/\d+/)?.[0] || '0');
      return num >= 100 && num < 200;
    }),
    '200': systemCourses.filter(c => {
      const code = c.course_code || '';
      const num = parseInt(code.match(/\d+/)?.[0] || '0');
      return num >= 200 && num < 300;
    }),
    '300': systemCourses.filter(c => {
      const code = c.course_code || '';
      const num = parseInt(code.match(/\d+/)?.[0] || '0');
      return num >= 300 && num < 400;
    }),
    '400': systemCourses.filter(c => {
      const code = c.course_code || '';
      const num = parseInt(code.match(/\d+/)?.[0] || '0');
      return num >= 400 && num < 500;
    }),
    '500+': systemCourses.filter(c => {
      const code = c.course_code || '';
      const num = parseInt(code.match(/\d+/)?.[0] || '0');
      return num >= 500;
    }),
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/academic' },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Academic Registry Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor student progress and course completion rates
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <LoadingSkeleton type="stat" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle="Registered students"
            icon={<UserGroupIcon />}
            color="blue"
            onClick={() => router.push('/academic/students')}
          />
          
          <StatCard
            title="System Courses"
            value={stats.totalCourses}
            subtitle="In catalog"
            icon={<BookOpenIcon />}
            color="indigo"
            onClick={() => router.push('/academic/courses')}
          />
          
          <StatCard
            title="Total Enrollments"
            value={stats.totalEnrollments}
            subtitle="Across all students"
            icon={<AcademicCapIcon />}
            color="purple"
          />
          
          <StatCard
            title="Completions"
            value={stats.totalCompletions}
            subtitle={`${stats.averageCompletion}% completion rate`}
            icon={<CheckCircleIcon />}
            color="green"
          />
        </div>
      )}

      {/* Course Distribution Section */}
      <div className="bg-card rounded-lg shadow border border-border mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-primary" />
            System Courses by Level
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(coursesByLevel).map(([level, levelCourses]) => (
              <div key={level} className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {levelCourses.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Level {level}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Students Section */}
      <div className="bg-card rounded-lg shadow border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-primary" />
            Recent Students
          </h2>
        </div>
        <div className="p-6">
          {recentStudents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No students registered yet</p>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => router.push(`/academic/students/${student.id}`)}
                >
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">
                      {student.yearOfStudy || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.course || 'No major'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
