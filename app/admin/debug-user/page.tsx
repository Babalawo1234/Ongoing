'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/normalizedDatabase';

export default function DebugUserPage() {
  const [targetEmail, setTargetEmail] = useState('bola1@aun.edu.ng');
  const [userData, setUserData] = useState<any>(null);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = () => {
    const usersData = localStorage.getItem('aun_checksheet_users');
    if (usersData) {
      const users = JSON.parse(usersData);
      setAllUsers(users);
    }
  };

  const checkUser = () => {
    setMessage('');
    const usersData = localStorage.getItem('aun_checksheet_users');
    
    if (!usersData) {
      setMessage('No users found in system!');
      setMessageType('error');
      return;
    }

    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.email === targetEmail);

    if (!user) {
      setMessage(`User "${targetEmail}" not found!`);
      setMessageType('error');
      setUserData(null);
      return;
    }

    setUserData(user);
    setMessage(`User found: ${user.name}`);
    setMessageType('success');

    // Load courses
    const userCoursesKey = `user_courses_${user.id}`;
    const courses = localStorage.getItem(userCoursesKey);
    if (courses) {
      setCoursesData(JSON.parse(courses));
    } else {
      setCoursesData([]);
    }

    // Load gamification
    const gamKey = `gamification_${user.id}`;
    const gam = localStorage.getItem(gamKey);
    if (gam) {
      setGamificationData(JSON.parse(gam));
    } else {
      setGamificationData(null);
    }
  };

  const initializeCourses = () => {
    if (!userData) {
      setMessage('No user selected!');
      setMessageType('error');
      return;
    }

    if (!userData.course) {
      setMessage('User has no program/course assigned!');
      setMessageType('error');
      return;
    }

    try {
      db.initializeStudentCourses(userData.id, userData.course, userData.degreeType);
      setMessage('Courses initialized successfully!');
      setMessageType('success');
      
      // Reload courses
      setTimeout(() => checkUser(), 500);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    }
  };

  const forceReinitializeCourses = () => {
    if (!userData) {
      setMessage('No user selected!');
      setMessageType('error');
      return;
    }

    if (!confirm('This will reset all course progress. Continue?')) {
      return;
    }

    try {
      db.forceReinitializeStudentCourses(userData.id, userData.course, userData.degreeType);
      setMessage('Courses reinitialized successfully!');
      setMessageType('success');
      
      // Reload courses
      setTimeout(() => checkUser(), 500);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    }
  };

  const getCourseStats = () => {
    if (coursesData.length === 0) return null;

    const byLevel: Record<string, any> = {};
    coursesData.forEach(course => {
      const level = course.level || 'Unknown';
      if (!byLevel[level]) {
        byLevel[level] = { total: 0, completed: 0 };
      }
      byLevel[level].total++;
      if (course.completed) {
        byLevel[level].completed++;
      }
    });

    return byLevel;
  };

  const stats = getCourseStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔍 Debug User Progress
        </h1>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Search User
          </h2>
          <div className="flex gap-4">
            <input
              type="email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={checkUser}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Check User
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              messageType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              messageType === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* User Data */}
        {userData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student ID</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.studentId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Program</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.course || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Degree Type</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.degreeType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Year of Study</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.yearOfStudy || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Courses Data */}
        {userData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Courses ({coursesData.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={initializeCourses}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Initialize Courses
                </button>
                <button
                  onClick={forceReinitializeCourses}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                >
                  Force Reinitialize
                </button>
              </div>
            </div>

            {coursesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No courses found. Click "Initialize Courses" to set up courses for this user.
              </div>
            ) : (
              <>
                {stats && (
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {Object.entries(stats).map(([level, data]: [string, any]) => (
                      <div key={level} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{level}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {data.completed}/{data.total}
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(data.completed / data.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Code</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Level</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Credits</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesData.slice(0, 20).map((course, idx) => (
                        <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{course.code}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{course.title}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{course.level}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{course.credits}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              course.completed 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {course.completed ? 'Completed' : 'Not Started'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{course.grade || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {coursesData.length > 20 && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Showing first 20 of {coursesData.length} courses
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Gamification Data */}
        {userData && gamificationData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gamification Stats
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gamificationData.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gamificationData.totalXP}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {gamificationData.achievements?.filter((a: any) => a.unlocked).length || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Users List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            All Users ({allUsers.length})
          </h2>
          <div className="max-h-64 overflow-y-auto">
            {allUsers.map((user, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setTargetEmail(user.email);
                  checkUser();
                }}
                className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{user.course} - {user.degreeType}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
