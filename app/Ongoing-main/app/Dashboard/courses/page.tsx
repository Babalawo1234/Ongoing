'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  completed: boolean;
  grade: string;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('100L');

  useEffect(() => {
    if (!user) return;
    
    const loadCourses = async () => {
      // Load user-specific courses
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      
      if (saved) {
        setCourses(JSON.parse(saved));
      } else if (user.course) {
        // Initialize courses for existing users who don't have courses yet
        const { initializeUserCourses } = await import('@/app/lib/courseData');
        initializeUserCourses(user.id, user.course);
        const newSaved = localStorage.getItem(userCoursesKey);
        if (newSaved) {
          setCourses(JSON.parse(newSaved));
        }
      }
    };
    
    loadCourses();

    const handleStorage = () => {
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      if (saved) {
        setCourses(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  const levels = ['100L', '200L', '300L', '400L'];
  
  const groupedCourses = levels.reduce((acc, level) => {
    acc[level] = courses.filter(c => c.level === level);
    return acc;
  }, {} as Record<string, Course[]>);

  const selectedCourses = groupedCourses[selectedLevel] || [];

  const calculateLevelStats = (level: string) => {
    const levelCourses = courses.filter(c => c.level === level);
    const completed = levelCourses.filter(c => c.completed).length;
    const total = levelCourses.length;
    const totalCredits = levelCourses.reduce((sum, c) => sum + c.credits, 0);
    const completedCredits = levelCourses.filter(c => c.completed).reduce((sum, c) => sum + c.credits, 0);
    return { completed, total, totalCredits, completedCredits };
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'C': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'E':
      case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="page-transition">
      <div className="mb-8 animate-slide-in-down">
        <h1 className="text-4xl font-bold gradient-text mb-2">My Courses</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Browse courses organized by level</p>
        {user && user.course && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {user.name} • {user.course} • {user.yearOfStudy ? `${user.yearOfStudy} Level` : ''}
          </p>
        )}
      </div>

      {/* Level Selector */}
      <div className="mb-6 modern-card p-6 animate-slide-in-left">
        <div className="flex flex-wrap gap-3">
          {levels.map(level => {
            const stats = calculateLevelStats(level);
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 min-w-[200px] px-6 py-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  selectedLevel === level
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl scale-105 animate-glow'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">{level}</span>
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <div className="text-sm">
                  <div>{stats.completed} / {stats.total} Courses</div>
                  <div className="mt-1">{stats.completedCredits} / {stats.totalCredits} Credits</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course List */}
      <div className="modern-card animate-fadeIn">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedLevel} Courses</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {selectedCourses.filter(c => c.completed).length} of {selectedCourses.length} courses completed
          </p>
        </div>
        <div className="p-6">
          {selectedCourses.length > 0 ? (
            <div className="space-y-4">
              {selectedCourses.map(course => (
                <div
                  key={course.id}
                  className={`border rounded-xl p-5 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl ${
                    course.completed
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                      : 'border-gray-300 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {course.completed ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <ClockIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {course.code}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">{course.title}</p>
                        </div>
                      </div>
                      <div className="ml-9 flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          <strong>Credits:</strong> {course.credits}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.completed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {course.completed ? 'Completed' : 'In Progress'}
                        </span>
                        {course.completed && course.grade && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(course.grade)}`}>
                            Grade: {course.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses available</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No courses found for {selectedLevel}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 modern-card p-6 animate-slide-in-left">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Overall Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl hover-lift stagger-1">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl hover-lift stagger-2">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {courses.filter(c => c.completed).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 rounded-xl hover-lift stagger-3">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {courses.filter(c => !c.completed).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl hover-lift stagger-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {courses.reduce((sum, c) => sum + c.credits, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Credits</div>
          </div>
        </div>
      </div>
    </div>
  );
}
