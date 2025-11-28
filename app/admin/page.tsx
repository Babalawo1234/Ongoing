'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/app/components/ui/StatCard';
import Breadcrumb from '@/app/components/ui/Breadcrumb';
import LoadingSkeleton from '@/app/components/ui/LoadingSkeleton';
import { db } from '@/app/lib/normalizedDatabase';

interface SystemStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  averageGPA: number;
  deansListStudents: number;
  probationStudents: number;
  totalPrograms: number;
  totalDepartments: number;
}

interface StudentByLevel {
  level: string;
  count: number;
  percentage: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    averageGPA: 0,
    deansListStudents: 0,
    probationStudents: 0,
    totalPrograms: 0,
    totalDepartments: 0,
  });

  const [studentsByLevel, setStudentsByLevel] = useState<StudentByLevel[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate GPA for a student
  const calculateStudentGPA = (courses: any[]): number => {
    const completed = courses.filter((c: any) => c.completed && c.grade);
    if (completed.length === 0) return 0;

    const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    let totalPoints = 0;
    let totalCredits = 0;

    completed.forEach((course: any) => {
      if (course.grade && gradePoints[course.grade] !== undefined) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  // Load real data from localStorage and normalized database
  useEffect(() => {
    const loadStats = () => {
      try {
        // Get all registered users
        const usersData = localStorage.getItem('aun_checksheet_users');
        const users = usersData ? JSON.parse(usersData) : [];
        
        // Filter only students
        const students = users.filter((u: any) => u.role === 'student');
        
        // Calculate GPA statistics
        let totalGPA = 0;
        let deansListCount = 0;
        let probationCount = 0;
        let studentsWithGPA = 0;
        
        // Track students by level
        const levelCounts: { [key: string]: number } = {
          '100': 0,
          '200': 0,
          '300': 0,
          '400': 0,
          '500': 0,
          '600': 0,
        };

        students.forEach((student: any) => {
          // Count by level
          const level = student.yearOfStudy;
          if (levelCounts[level] !== undefined) {
            levelCounts[level]++;
          }

          // Calculate GPA
          const userCoursesKey = `user_courses_${student.id}`;
          const coursesData = localStorage.getItem(userCoursesKey);
          
          if (coursesData) {
            const courses = JSON.parse(coursesData);
            const gpa = calculateStudentGPA(courses);
            
            if (gpa > 0) {
              totalGPA += gpa;
              studentsWithGPA++;
              
              if (gpa >= 4.5) deansListCount++;
              if (gpa < 2.0) probationCount++;
            }
          }
        });

        // Calculate average GPA
        const averageGPA = studentsWithGPA > 0 ? totalGPA / studentsWithGPA : 0;

        // Get course and program counts from normalized database
        const totalCourses = db.getCourses().length;
        const totalPrograms = db.getPrograms().length;
        const totalDepartments = db.getDepartments().length;

        // Calculate students by level with percentages
        const totalStudents = students.length;
        const studentsByLevelArray: StudentByLevel[] = [
          { level: '100L', count: levelCounts['100'], percentage: totalStudents > 0 ? (levelCounts['100'] / totalStudents) * 100 : 0 },
          { level: '200L', count: levelCounts['200'], percentage: totalStudents > 0 ? (levelCounts['200'] / totalStudents) * 100 : 0 },
          { level: '300L', count: levelCounts['300'], percentage: totalStudents > 0 ? (levelCounts['300'] / totalStudents) * 100 : 0 },
          { level: '400L', count: levelCounts['400'], percentage: totalStudents > 0 ? (levelCounts['400'] / totalStudents) * 100 : 0 },
          { level: '500L', count: levelCounts['500'], percentage: totalStudents > 0 ? (levelCounts['500'] / totalStudents) * 100 : 0 },
          { level: '600L', count: levelCounts['600'], percentage: totalStudents > 0 ? (levelCounts['600'] / totalStudents) * 100 : 0 },
        ].filter(level => level.count > 0); // Only show levels with students

        setStats({
          totalStudents: students.length,
          activeStudents: students.length, // Consider all registered students as active
          totalCourses,
          averageGPA,
          deansListStudents: deansListCount,
          probationStudents: probationCount,
          totalPrograms,
          totalDepartments,
        });

        setStudentsByLevel(studentsByLevelArray);
        setLoading(false);
      } catch (error) {
        console.error('Error loading admin stats:', error);
        setLoading(false);
      }
    };

    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-content">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">System overview and key metrics</p>
      </div>

      {/* Quick Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <LoadingSkeleton type="stat" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle={`${stats.activeStudents} active`}
            icon={<UsersIcon />}
            color="blue"
            onClick={() => router.push('/admin/students')}
          />

          <StatCard
            title="Average GPA"
            value={stats.averageGPA.toFixed(2)}
            subtitle="System-wide"
            icon={<ChartBarIcon />}
            color="green"
          />

          <StatCard
            title="Dean's List"
            value={stats.deansListStudents}
            subtitle="GPA ≥ 4.5"
            icon={<TrophyIcon />}
            color="purple"
            trend={{ value: 12, isPositive: true, label: 'vs last semester' }}
          />

          <StatCard
            title="On Probation"
            value={stats.probationStudents}
            subtitle="GPA < 2.0"
            icon={<ExclamationTriangleIcon />}
            color="red"
            trend={{ value: 5, isPositive: false, label: 'vs last semester' }}
          />
        </div>
      )}

      {/* Students by Level & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '400ms' }}>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Students by Academic Level</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
              </div>
            ) : studentsByLevel.length > 0 ? (
              <div className="space-y-6">
                {studentsByLevel.map((level, index) => (
                  <div key={level.level} className="transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{level.level}</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {level.count} students ({level.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${level.percentage}%`, transitionDelay: `${index * 100}ms` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">No students registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Database Summary */}
        <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '500ms' }}>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Database</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <BookOpenIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                <AcademicCapIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPrograms}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Programs</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDepartments}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                <UsersIcon className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average System GPA</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {stats.averageGPA > 0 ? stats.averageGPA.toFixed(2) : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Out of 5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Performance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Programs"
          value={stats.totalPrograms}
          subtitle="Active programs"
          icon={<AcademicCapIcon />}
          color="blue"
        />

        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          subtitle="Across all schools"
          icon={<ChartBarIcon />}
          color="green"
        />

        <StatCard
          title="Course Catalog"
          value={stats.totalCourses}
          subtitle="Total courses"
          icon={<BookOpenIcon />}
          color="purple"
          onClick={() => router.push('/admin/courses')}
        />
      </div>

      {/* Quick Actions */}
      <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8" style={{ animationDelay: '900ms' }}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => router.push('/admin/students')}
            className="group px-6 py-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold"
          >
            <span className="group-hover:scale-110 inline-block transition-transform">View Students</span>
          </button>
          <button 
            onClick={() => router.push('/admin/courses/manage')}
            className="group px-6 py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold"
          >
            <span className="group-hover:scale-110 inline-block transition-transform">Manage Courses</span>
          </button>
          <button 
            onClick={() => router.push('/admin/programs')}
            className="group px-6 py-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold"
          >
            <span className="group-hover:scale-110 inline-block transition-transform">Manage Programs</span>
          </button>
          <button 
            onClick={() => router.push('/admin/reports')}
            className="group px-6 py-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold"
          >
            <span className="group-hover:scale-110 inline-block transition-transform">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
