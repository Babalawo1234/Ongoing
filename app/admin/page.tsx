'use client';

import { useState, useEffect } from 'react';
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/app/components/StatCard';

interface SystemStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  averageGPA: number;
  deansListStudents: number;
  probationStudents: number;
  recentLogins: number;
  gradeUpdates: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    totalStudents: 245,
    activeStudents: 238,
    totalCourses: 68,
    averageGPA: 3.42,
    deansListStudents: 45,
    probationStudents: 12,
    recentLogins: 156,
    gradeUpdates: 42,
  });

  const [studentsByLevel, setStudentsByLevel] = useState([
    { level: '100L', count: 75, percentage: 30.6 },
    { level: '200L', count: 68, percentage: 27.8 },
    { level: '300L', count: 62, percentage: 25.3 },
    { level: '400L', count: 40, percentage: 16.3 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'grade', message: 'Grade posted for CS 301 - 15 students', time: '5 minutes ago' },
    { id: 2, type: 'login', message: 'Sarah Johnson logged in', time: '12 minutes ago' },
    { id: 3, type: 'registration', message: '8 students registered for Spring 2024', time: '1 hour ago' },
    { id: 4, type: 'grade', message: 'Grade updated for MATH 201 - 22 students', time: '2 hours ago' },
  ]);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">System overview and key metrics</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle={`${stats.activeStudents} active`}
          icon={<UsersIcon className="w-full h-full" />}
          gradient="from-blue-500 to-cyan-600"
          delay={0}
        />

        <StatCard
          title="Average GPA"
          value={stats.averageGPA.toFixed(2)}
          subtitle="System-wide"
          icon={<ChartBarIcon className="w-full h-full" />}
          gradient="from-green-500 to-emerald-600"
          delay={100}
        />

        <StatCard
          title="Dean's List"
          value={stats.deansListStudents}
          subtitle="GPA ≥ 4.5"
          icon={<TrophyIcon className="w-full h-full" />}
          gradient="from-purple-500 to-pink-600"
          delay={200}
        />

        <StatCard
          title="On Probation"
          value={stats.probationStudents}
          subtitle="GPA < 2.0"
          icon={<ExclamationTriangleIcon className="w-full h-full" />}
          gradient="from-red-500 to-orange-600"
          delay={300}
        />
      </div>

      {/* Students by Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '400ms' }}>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Students by Academic Level</h2>
          </div>
          <div className="p-6">
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
          </div>
        </div>

        {/* Recent Activity */}
        <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500" style={{ animationDelay: '500ms' }}>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className={`p-3 rounded-xl shadow-md ${
                    activity.type === 'grade' ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                    activity.type === 'login' ? 'bg-gradient-to-br from-blue-400 to-cyan-600' :
                    'bg-gradient-to-br from-purple-400 to-pink-600'
                  }`}>
                    <div className="h-3 w-3 rounded-full bg-white shadow-inner" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Recent Logins"
          value={stats.recentLogins}
          subtitle="Last 24 hours"
          icon={<UsersIcon className="w-full h-full" />}
          gradient="from-blue-500 to-cyan-600"
          delay={600}
        />

        <StatCard
          title="Grade Updates"
          value={stats.gradeUpdates}
          subtitle="Last 24 hours"
          icon={<AcademicCapIcon className="w-full h-full" />}
          gradient="from-green-500 to-emerald-600"
          delay={700}
        />

        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          subtitle="Active catalog"
          icon={<BookOpenIcon className="w-full h-full" />}
          gradient="from-purple-500 to-pink-600"
          delay={800}
        />
      </div>

      {/* Quick Actions */}
      <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8" style={{ animationDelay: '900ms' }}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="group px-6 py-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold">
            <span className="group-hover:scale-110 inline-block transition-transform">Add Student</span>
          </button>
          <button className="group px-6 py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold">
            <span className="group-hover:scale-110 inline-block transition-transform">Add Course</span>
          </button>
          <button className="group px-6 py-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold">
            <span className="group-hover:scale-110 inline-block transition-transform">Generate Report</span>
          </button>
          <button className="group px-6 py-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold">
            <span className="group-hover:scale-110 inline-block transition-transform">Send Notification</span>
          </button>
        </div>
      </div>
    </div>
  );
}
