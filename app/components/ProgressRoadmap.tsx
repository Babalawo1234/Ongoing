'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  semester?: number;
  completed: boolean;
  grade: string;
}

interface ProgressRoadmapProps {
  userId: string;
  degreeType?: string;
}

export default function ProgressRoadmap({ userId, degreeType }: ProgressRoadmapProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
    
    const handleStorage = () => {
      loadCourses();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [userId]);

  const loadCourses = () => {
    const userCoursesKey = `user_courses_${userId}`;
    const saved = localStorage.getItem(userCoursesKey);
    if (saved) {
      setCourses(JSON.parse(saved));
    }
  };

  // Determine if user is Master's student
  const isMasterStudent = degreeType && 
    (degreeType.startsWith('M.') || degreeType.includes('Master'));

  const levels = isMasterStudent 
    ? ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'] 
    : ['100L', '200L', '300L', '400L'];
  
  const groupBySemester = (levelCourses: Course[]) => {
    const semester1 = levelCourses.filter(c => c.semester === 1 || c.semester === 3 || c.semester === 5 || c.semester === 7);
    const semester2 = levelCourses.filter(c => c.semester === 2 || c.semester === 4 || c.semester === 6 || c.semester === 8);
    return { semester1, semester2 };
  };

  const calculateLevelProgress = (level: string) => {
    let levelCourses: Course[];
    
    if (isMasterStudent) {
      // For Master's students, filter by semester number (1-4)
      const semesterNum = level === 'Semester 1' ? 1 
        : level === 'Semester 2' ? 2 
        : level === 'Semester 3' ? 3 
        : 4;
      levelCourses = courses.filter(c => c.semester === semesterNum);
    } else {
      // For Bachelor's students, filter by level
      levelCourses = courses.filter(c => c.level === level);
    }
    
    const completed = levelCourses.filter(c => c.completed).length;
    const total = levelCourses.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getStatusIcon = (course: Course) => {
    if (course.completed) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    return <ClockIcon className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (course: Course) => {
    if (course.completed) {
      return 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700';
    }
    return 'bg-gray-50 border-gray-300 dark:bg-gray-700/50 dark:border-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Academic Journey</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {levels.map(level => {
            const progress = calculateLevelProgress(level);
            return (
              <div key={level} className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">{level}</div>
                <div className="text-2xl font-bold">{progress.completed}/{progress.total}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap by Level */}
      {levels.map((level, levelIndex) => {
        let levelCourses: Course[];
        
        if (isMasterStudent) {
          // For Master's students, filter by semester (1-4)
          const semesterNum = level === 'Semester 1' ? 1 
            : level === 'Semester 2' ? 2 
            : level === 'Semester 3' ? 3 
            : 4;
          levelCourses = courses.filter(c => c.semester === semesterNum);
        } else {
          // For Bachelor's students, filter by level
          levelCourses = courses.filter(c => c.level === level);
        }
        
        const { semester1, semester2 } = groupBySemester(levelCourses);
        const progress = calculateLevelProgress(level);

        if (levelCourses.length === 0) return null;

        return (
          <div key={level} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Level Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-b border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {levelIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {isMasterStudent ? level : `${level} - Year ${levelIndex + 1}`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {progress.completed} of {progress.total} courses completed ({progress.percentage.toFixed(0)}%)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {progress.percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Semesters */}
            <div className="p-6">
              {isMasterStudent ? (
                // For Master's students, show courses directly without subsections
                <div className="space-y-3">
                  {levelCourses.map(course => (
                    <div
                      key={course.id}
                      className={`border rounded-lg p-3 transition-all ${getStatusColor(course)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(course)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                              {course.code}
                            </span>
                            {course.completed && course.grade && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                                {course.grade}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {course.title}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {course.credits} credits
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // For Bachelor's students, show semester subsections
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Semester 1 */}
                  {semester1.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                          1
                        </span>
                        First Semester
                      </h4>
                    <div className="space-y-3">
                      {semester1.map(course => (
                        <div
                          key={course.id}
                          className={`border rounded-lg p-3 transition-all ${getStatusColor(course)}`}
                        >
                          <div className="flex items-start gap-3">
                            {getStatusIcon(course)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {course.code}
                                </span>
                                {course.completed && course.grade && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                                    {course.grade}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                                {course.title}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {course.credits} credits
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Semester 2 */}
                {semester2.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      Second Semester
                    </h4>
                    <div className="space-y-3">
                      {semester2.map(course => (
                        <div
                          key={course.id}
                          className={`border rounded-lg p-3 transition-all ${getStatusColor(course)}`}
                        >
                          <div className="flex items-start gap-3">
                            {getStatusIcon(course)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {course.code}
                                </span>
                                {course.completed && course.grade && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                                    {course.grade}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                                {course.title}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {course.credits} credits
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
