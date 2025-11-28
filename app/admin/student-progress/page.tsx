'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/app/components/ui/StatCard';
import Breadcrumb from '@/app/components/ui/Breadcrumb';
import EmptyState from '@/app/components/ui/EmptyState';
import {
  getAllStudents,
  calculateStudentProgress,
  getSystemStats,
  subscribeToStorageChanges,
} from '@/app/lib/sharedStorage';

interface Student {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  studentId?: string;
  department?: string;
  yearOfStudy?: string;
}

export default function StudentProgressPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load students from shared storage
  const loadStudents = useCallback(() => {
    setIsRefreshing(true);
    const studentUsers = getAllStudents();
    setStudents(studentUsers);
    setLoading(false);
    setLastUpdate(new Date());
    setIsRefreshing(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Real-time updates: Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = subscribeToStorageChanges((key, value) => {
      // Reload when relevant data changes
      if (
        key === 'aun_checksheet_users' ||
        key === 'student_grades' ||
        key.startsWith('user_courses_')
      ) {
        loadStudents();
      }
    });

    return unsubscribe;
  }, [loadStudents]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadStudents();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadStudents]);

  const getStudentProgress = (studentId: string) => {
    return calculateStudentProgress(studentId);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalStats = students.reduce((acc, student) => {
    const progress = getStudentProgress(student.id);
    return {
      totalCredits: acc.totalCredits + progress.creditsEarned,
      totalCompleted: acc.totalCompleted + progress.completed,
      totalEnrolled: acc.totalEnrolled + progress.enrolled,
    };
  }, { totalCredits: 0, totalCompleted: 0, totalEnrolled: 0 });

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Student Progress' },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Progress Monitor</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View-only access to student academic progress and course completion
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                <EyeIcon className="h-4 w-4" />
                <span>Read-Only Access</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Real-Time Sync (5s)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Last updated</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={students.length}
          subtitle="Registered"
          icon={<AcademicCapIcon />}
          color="blue"
        />
        <StatCard
          title="Total Credits Earned"
          value={totalStats.totalCredits}
          subtitle="Across all students"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatCard
          title="Courses Completed"
          value={totalStats.totalCompleted}
          subtitle="Total completions"
          icon={<BookOpenIcon />}
          color="purple"
        />
        <StatCard
          title="Currently Enrolled"
          value={totalStats.totalEnrolled}
          subtitle="Active courses"
          icon={<ClockIcon />}
          color="orange"
        />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Credits Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState
                      icon={<AcademicCapIcon />}
                      title="No students found"
                      description="Try adjusting your search criteria"
                    />
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const progress = getStudentProgress(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {student.fullName || student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.studentId || student.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {student.department || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          {progress.creditsEarned} credits
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                          {progress.completed} courses
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400">
                          {progress.enrolled} courses
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/students/${student.id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
