'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon,
  TrophyIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface DegreeRequirement {
  category: string;
  required: number;
  completed: number;
  percentage: number;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<DegreeRequirement[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [gpa, setGPA] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const loadCourses = async () => {
      // Load user-specific courses
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      
      if (saved) {
        const courses = JSON.parse(saved);
        calculateRequirements(courses);
      } else if (user.course) {
        // Initialize courses for existing users who don't have courses yet
        const { initializeUserCourses } = await import('@/app/lib/courseData');
        initializeUserCourses(user.id, user.course);
        const newSaved = localStorage.getItem(userCoursesKey);
        if (newSaved) {
          calculateRequirements(JSON.parse(newSaved));
        }
      }
    };
    
    loadCourses();

    // Listen for updates
    const handleStorage = () => {
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      if (saved) {
        calculateRequirements(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  const calculateRequirements = (courses: any[]) => {
    const levels = ['100L', '200L', '300L', '400L'];
    const reqs: DegreeRequirement[] = levels.map(level => {
      const levelCourses = courses.filter((c: any) => c.level === level);
      const completed = levelCourses.filter((c: any) => c.completed).length;
      const total = levelCourses.length;
      return {
        category: `${level} Courses`,
        required: total,
        completed,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      };
    });

    setRequirements(reqs);

    // Calculate overall progress
    const totalCourses = courses.length;
    const completedCourses = courses.filter((c: any) => c.completed).length;
    setOverallProgress(totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0);

    // Calculate credits
    const total = courses.reduce((sum: number, c: any) => sum + c.credits, 0);
    const earned = courses.filter((c: any) => c.completed).reduce((sum: number, c: any) => sum + c.credits, 0);
    setTotalCredits(total);
    setEarnedCredits(earned);

    // Calculate GPA
    const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    const completedWithGrades = courses.filter((c: any) => c.completed && c.grade);
    let totalPoints = 0;
    let totalGradeCredits = 0;
    
    completedWithGrades.forEach((course: any) => {
      if (gradePoints[course.grade] !== undefined) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalGradeCredits += course.credits;
      }
    });
    
    setGPA(totalGradeCredits > 0 ? totalPoints / totalGradeCredits : 0);
  };

  return (
    <div className="page-transition">
      <div className="mb-8 animate-slide-in-down">
        <h1 className="text-5xl font-bold gradient-text mb-3">
          Academic Progress
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Track your degree completion status</p>
        {user && user.course && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {user.name} • {user.course} • {user.yearOfStudy ? `${user.yearOfStudy} Level` : ''}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
        <div className="modern-card p-6 hover-lift stagger-1" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{overallProgress.toFixed(0)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg float-animation">
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="modern-card p-6 hover-lift stagger-2" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Credits Earned</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{earnedCredits}/{totalCredits}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg float-animation">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="modern-card p-6 hover-lift stagger-3" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current GPA</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpa.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg float-animation">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="modern-card p-8 hover-lift mb-8 stagger-4" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overall Degree Progress</h2>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {overallProgress.toFixed(1)}%
          </span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden shadow-inner">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full shadow-lg animate-gradient animate-progress"
            style={{ width: `${overallProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {earnedCredits} of {totalCredits} credits completed
          </p>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {totalCredits - earnedCredits} credits remaining
          </p>
        </div>
      </div>

      {/* Requirements by Level */}
      <div className="modern-card animate-slide-in-left">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Degree Requirements</h2>
        </div>
        <div className="p-6 space-y-6">
          {requirements.map((req, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{req.category}</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {req.completed} / {req.required} courses
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 animate-progress ${
                    req.percentage === 100
                      ? 'bg-green-600'
                      : req.percentage >= 50
                      ? 'bg-blue-600'
                      : 'bg-yellow-600'
                  }`}
                  style={{ width: `${req.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-sm text-gray-700">Completed (100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded" />
            <span className="text-sm text-gray-700">In Progress (50-99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded" />
            <span className="text-sm text-gray-700">Started (0-49%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
