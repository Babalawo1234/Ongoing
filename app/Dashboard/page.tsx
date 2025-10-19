'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  BookOpenIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/app/components/StatCard';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCredits: 0,
    earnedCredits: 0,
    gpa: 0.0,
    completedCourses: 0,
    inProgressCourses: 0,
    progress: 0,
  });

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCourses = localStorage.getItem('academicCourses');
      if (savedCourses) {
        const courses = JSON.parse(savedCourses);
        calculateStats(courses);
      }
    }
  }, []);

  const calculateStats = (courses: any[]) => {
    const completed = courses.filter(c => c.completed);
    const inProgress = courses.filter(c => !c.completed);
    const earnedCredits = completed.reduce((sum, c) => sum + c.credits, 0);
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    
    // Calculate GPA
    const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    let totalPoints = 0;
    let totalGradeCredits = 0;
    
    completed.forEach(course => {
      if (course.grade && gradePoints[course.grade] !== undefined) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalGradeCredits += course.credits;
      }
    });
    
    const gpa = totalGradeCredits > 0 ? totalPoints / totalGradeCredits : 0;
    const progress = totalCredits > 0 ? (earnedCredits / totalCredits) * 100 : 0;

    setStats({
      totalCredits,
      earnedCredits,
      gpa,
      completedCourses: completed.length,
      inProgressCourses: inProgress.length,
      progress,
    });
  };

  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Welcome back! Here's your academic progress overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Credits Earned"
          value={`${stats.earnedCredits} / ${stats.totalCredits}`}
          subtitle={`${stats.progress.toFixed(0)}% Complete`}
          icon={<BookOpenIcon className="w-full h-full" />}
          gradient="from-blue-500 to-cyan-600"
          delay={0}
        />

        <StatCard
          title="Current GPA"
          value={stats.gpa.toFixed(2)}
          subtitle="Out of 5.0"
          icon={<TrophyIcon className="w-full h-full" />}
          gradient="from-green-500 to-emerald-600"
          delay={100}
        />

        <StatCard
          title="Degree Progress"
          value={`${stats.progress.toFixed(0)}%`}
          subtitle={`${stats.earnedCredits} credits earned`}
          icon={<ChartBarIcon className="w-full h-full" />}
          gradient="from-purple-500 to-pink-600"
          delay={200}
        />

        <StatCard
          title="Completed Courses"
          value={stats.completedCourses}
          subtitle="Successfully finished"
          icon={<CheckCircleIcon className="w-full h-full" />}
          gradient="from-emerald-500 to-teal-600"
          delay={300}
        />

        <StatCard
          title="In Progress"
          value={stats.inProgressCourses}
          subtitle="Currently enrolled"
          icon={<ClockIcon className="w-full h-full" />}
          gradient="from-yellow-500 to-orange-600"
          delay={400}
        />

        <StatCard
          title="Academic Standing"
          value={stats.gpa >= 4.5 ? "Dean's List" : stats.gpa >= 3.5 ? 'Good Standing' : stats.gpa >= 2.0 ? 'Satisfactory' : 'Probation'}
          subtitle={`GPA: ${stats.gpa.toFixed(2)}`}
          icon={<AcademicCapIcon className="w-full h-full" />}
          gradient="from-indigo-500 to-purple-600"
          delay={500}
        />
      </div>

      {/* Progress Bar */}
      <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overall Degree Progress</h2>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {stats.progress.toFixed(1)}%
          </span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg animate-gradient"
            style={{ width: `${stats.progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {stats.earnedCredits} of {stats.totalCredits} credits completed
          </p>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {stats.totalCredits - stats.earnedCredits} remaining
          </p>
        </div>
      </div>
    </div>
  );
}
