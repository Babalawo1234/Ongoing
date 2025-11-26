'use client';

import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Load courses from localStorage
    const savedCourses = localStorage.getItem('academicCourses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }

    // Load students from localStorage
    const savedUsers = localStorage.getItem('aun_checksheet_users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      const studentUsers = allUsers.filter((u: any) => u.role === 'student');
      setStudents(studentUsers);
    }
  }, []);

  const stats = {
    totalStudents: students.length,
    totalCourses: courses.length,
    completedCourses: courses.filter(c => c.completed).length,
    inProgressCourses: courses.filter(c => c.status === 'In Progress').length,
    averageCompletion: courses.length > 0 
      ? Math.round((courses.filter(c => c.completed).length / courses.length) * 100)
      : 0,
  };

  const recentStudents = students.slice(0, 5);
  const coursesByLevel = {
    '100L': courses.filter(c => c.level === '100L'),
    '200L': courses.filter(c => c.level === '200L'),
    '300L': courses.filter(c => c.level === '300L'),
    '400L': courses.filter(c => c.level === '400L'),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Advisor Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor student progress and course completion rates
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students Card */}
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-105">{stats.totalStudents}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <UserGroupIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-blue-500 to-cyan-600" />
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-105">{stats.totalCourses}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <BookOpenIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-indigo-500 to-purple-600" />
          </div>
        </div>

        {/* Completed Courses Card */}
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-105">{stats.completedCourses}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <CheckCircleIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-green-500 to-emerald-600" />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-105">{stats.inProgressCourses}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <ClockIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-yellow-500 to-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Course Distribution by Level */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Course Distribution by Level
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(coursesByLevel).map(([level, levelCourses]) => {
                const completed = levelCourses.filter(c => c.completed).length;
                const total = levelCourses.length;
                const percentage = total > 0 ? (completed / total) * 100 : 0;
                
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{level}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {completed}/{total} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Recent Students
            </h2>
          </div>
          <div className="p-6">
            {recentStudents.length > 0 ? (
              <div className="space-y-3">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <AcademicCapIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{student.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{student.email}</p>
                    </div>
                    {student.yearOfStudy && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs font-medium">
                        {student.yearOfStudy}L
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No students registered yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Course Completion Rate
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {stats.averageCompletion}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
              style={{ width: `${stats.averageCompletion}%` }}
            >
              {stats.averageCompletion > 10 && (
                <span className="text-xs font-bold text-white">{stats.averageCompletion}%</span>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.completedCourses}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.inProgressCourses}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {courses.filter(c => c.status === 'Not Started').length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Not Started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
