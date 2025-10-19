'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  studentId: string;
  yearOfStudy: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
}

interface Grade {
  studentId: string;
  courseId: string;
  grade: string;
}

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalCredits: 0,
    averageGPA: 0,
    highPerformers: 0,
    lowPerformers: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load students
    const storedUsers = localStorage.getItem('aun_checksheet_users');
    if (storedUsers) {
      const allUsers = JSON.parse(storedUsers);
      const studentUsers = allUsers.filter((u: any) => u.role === 'student');
      setStudents(studentUsers);
    }

    // Load courses
    const storedCourses = localStorage.getItem('admin_courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    }

    // Load grades
    const storedGrades = localStorage.getItem('student_grades');
    if (storedGrades) {
      setGrades(JSON.parse(storedGrades));
    }
  };

  useEffect(() => {
    calculateStats();
  }, [students, courses, grades]);

  const calculateGPA = (studentId: string) => {
    const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    const studentGrades = grades.filter((g) => g.studentId === studentId);
    
    if (studentGrades.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    studentGrades.forEach((g) => {
      const course = courses.find((c) => c.id === g.courseId);
      if (course && gradePoints[g.grade] !== undefined) {
        totalPoints += gradePoints[g.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateStats = () => {
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    
    let totalGPA = 0;
    let studentsWithGrades = 0;
    let highPerformers = 0;
    let lowPerformers = 0;

    students.forEach((student) => {
      const gpa = calculateGPA(student.id);
      if (gpa > 0) {
        totalGPA += gpa;
        studentsWithGrades++;
        if (gpa >= 4.5) highPerformers++;
        if (gpa < 2.0) lowPerformers++;
      }
    });

    setStats({
      totalStudents: students.length,
      totalCourses: courses.length,
      totalCredits,
      averageGPA: studentsWithGrades > 0 ? totalGPA / studentsWithGrades : 0,
      highPerformers,
      lowPerformers,
    });
  };

  const getGradeDistribution = () => {
    const distribution: any = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    grades.forEach((g) => {
      if (distribution[g.grade] !== undefined) {
        distribution[g.grade]++;
      }
    });
    return distribution;
  };

  const getTopStudents = () => {
    return students
      .map((student) => ({
        ...student,
        gpa: calculateGPA(student.id),
        gradeCount: grades.filter((g) => g.studentId === student.id).length,
      }))
      .filter((s) => s.gpa > 0)
      .sort((a, b) => b.gpa - a.gpa)
      .slice(0, 5);
  };

  const getLevelDistribution = () => {
    const distribution: any = {};
    students.forEach((s) => {
      const level = `${s.yearOfStudy}L`;
      distribution[level] = (distribution[level] || 0) + 1;
    });
    return distribution;
  };

  const gradeDistribution = getGradeDistribution();
  const topStudents = getTopStudents();
  const levelDistribution = getLevelDistribution();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-gray-600">Comprehensive overview of academic performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalCredits} total credits</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpenIcon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average GPA</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageGPA.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrophyIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Performers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.highPerformers}</p>
              <p className="text-xs text-gray-500 mt-1">GPA ≥ 4.5</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <ArrowTrendingUpIcon className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.lowPerformers}</p>
              <p className="text-xs text-gray-500 mt-1">GPA &lt; 2.0</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ArrowTrendingDownIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Grades</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{grades.length}</p>
              <p className="text-xs text-gray-500 mt-1">Recorded grades</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {Object.entries(gradeDistribution).map(([grade, count]: [string, any]) => {
              const total = grades.length || 1;
              const percentage = (count / total) * 100;
              const color = 
                grade === 'A' ? 'bg-green-500' :
                grade === 'B' ? 'bg-blue-500' :
                grade === 'C' ? 'bg-yellow-500' :
                grade === 'D' || grade === 'E' ? 'bg-orange-500' : 'bg-red-500';

              return (
                <div key={grade}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Grade {grade}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Level Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Level</h3>
          <div className="space-y-3">
            {Object.entries(levelDistribution).sort().map(([level, count]: [string, any]) => {
              const percentage = (count / stats.totalStudents) * 100;

              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{level}</span>
                    <span className="text-sm text-gray-600">{count} students ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Performing Students */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Students</h3>
        {topStudents.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No student grades recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : index === 1
                              ? 'bg-gray-100 text-gray-800'
                              : index === 2
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.studentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {student.yearOfStudy}L
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-green-600">{student.gpa.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-500">{student.gradeCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
