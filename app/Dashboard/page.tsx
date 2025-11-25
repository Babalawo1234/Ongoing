'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  ChartBarIcon,
  BookOpenIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/app/components/StatCard';
import GPANotification from '@/app/components/GPANotification';
import LevelDisplay from '@/app/components/LevelDisplay';
import { GamificationManager } from '@/app/lib/gamification';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCredits: 0,
    earnedCredits: 0,
    gpa: 0.0,
    completedCourses: 0,
    inProgressCourses: 0,
    enrolledCourses: 0,
    progress: 0,
    achievementsUnlocked: 0,
    totalAchievements: 17,
  });
  const [showGPANotification, setShowGPANotification] = useState(false);
  const [plannerNotes, setPlannerNotes] = useState('');

  // Initialize gamification and show GPA notification
  useEffect(() => {
    if (!user) return;
    
    // Update streak and initialize gamification
    const manager = new GamificationManager(user.id);
    manager.updateStreak();
    
    // Get achievements data
    const gamData = manager.getData();
    const unlockedCount = gamData.achievements.filter((a: any) => a.unlocked).length;
    
    setStats(prev => ({
      ...prev,
      achievementsUnlocked: unlockedCount,
    }));
    
    // Show GPA notification on first visit per session
    const hasSeenNotification = sessionStorage.getItem('gpa_notification_shown');
    if (!hasSeenNotification) {
      // Delay to let dashboard load first
      const timer = setTimeout(() => {
        setShowGPANotification(true);
        sessionStorage.setItem('gpa_notification_shown', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Load planner notes
  useEffect(() => {
    if (!user) return;
    const savedNotes = localStorage.getItem(`planner_notes_${user.id}`);
    if (savedNotes) {
      setPlannerNotes(savedNotes);
    }
  }, [user]);

  // Save planner notes
  const savePlannerNotes = (notes: string) => {
    if (!user) return;
    setPlannerNotes(notes);
    localStorage.setItem(`planner_notes_${user.id}`, notes);
  };

  // Load stats from localStorage using user-specific courses
  useEffect(() => {
    if (!user) return;
    
    const loadCourses = async () => {
      // Load user-specific courses
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      
      if (saved) {
        const courses = JSON.parse(saved);
        calculateStats(courses);
      } else if (user.course) {
        // Initialize courses for existing users who don't have courses yet
        const { initializeUserCourses } = await import('@/app/lib/courseData');
        initializeUserCourses(user.id, user.course);
        const newSaved = localStorage.getItem(userCoursesKey);
        if (newSaved) {
          calculateStats(JSON.parse(newSaved));
        }
      }
    };
    
    loadCourses();

    // Listen for updates
    const handleStorage = () => {
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      if (saved) {
        calculateStats(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  const calculateStats = (courses: any[]) => {
    const completed = courses.filter(c => c.completed);
    const inProgress = courses.filter(c => !c.completed);
    // Enrolled = courses that are either in progress or completed (started)
    const enrolled = courses.filter(c => c.completed || c.status === 'In Progress' || c.grade);
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

    setStats(prev => ({
      ...prev,
      totalCredits,
      earnedCredits,
      gpa,
      completedCourses: completed.length,
      inProgressCourses: inProgress.length,
      enrolledCourses: enrolled.length,
      progress,
    }));
  };

  return (
    <>
      {showGPANotification && (
        <GPANotification onClose={() => setShowGPANotification(false)} />
      )}
      <div className="page-content">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Welcome back! Here's your academic progress overview.</p>
      </div>

      {/* Gamification Widget */}
      {user && (
        <div className="mb-8">
          <LevelDisplay userId={user.id} compact={true} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
        <Link href="/dashboard/achievements" className="group p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white hover:shadow-lg transition-all">
          <TrophyIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold">Achievements</p>
        </Link>
        <Link href="/dashboard/checksheet" className="group p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white hover:shadow-lg transition-all">
          <BookOpenIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold">Checksheet</p>
        </Link>
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
          title="Achievements"
          value={`${stats.achievementsUnlocked} / ${stats.totalAchievements}`}
          subtitle="Unlocked"
          icon={<TrophyIcon className="w-full h-full" />}
          gradient="from-yellow-500 to-orange-600"
          delay={200}
        />

        <StatCard
          title="Enrolled Courses"
          value={stats.enrolledCourses}
          subtitle="Started or completed"
          icon={<CheckCircleIcon className="w-full h-full" />}
          gradient="from-emerald-500 to-teal-600"
          delay={300}
        />

        <StatCard
          title="Completed Courses"
          value={stats.completedCourses}
          subtitle="Successfully finished"
          icon={<CheckCircleIcon className="w-full h-full" />}
          gradient="from-purple-500 to-pink-600"
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

      {/* Planner Notepad */}
      <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 mb-8" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DocumentTextIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
            Academic Planner
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Plan your semester</span>
        </div>
        <textarea
          value={plannerNotes}
          onChange={(e) => savePlannerNotes(e.target.value)}
          placeholder="Write your academic plans, goals, and notes here...&#10;&#10;Example:&#10;- Register for COS301 next semester&#10;- Study for midterms in Week 7&#10;- Complete capstone project proposal by March"
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Your notes are automatically saved
        </p>
      </div>

      {/* Progress Bar */}
      <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1" style={{ animationDelay: '700ms' }}>
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
    </>
  );
}
