'use client';

import { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
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

export default function AcademicCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('academicCourses');
    if (saved) {
      setCourses(JSON.parse(saved));
    }

    const handleStorage = () => {
      const saved = localStorage.getItem('academicCourses');
      if (saved) {
        setCourses(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const levels = ['100L', '200L', '300L', '400L'];
  const statuses = ['Not Started', 'In Progress', 'Completed'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'In Progress':
        return <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'Not Started':
        return <XCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
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

  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.completed).length,
    inProgress: courses.filter(c => c.status === 'In Progress').length,
    notStarted: courses.filter(c => c.status === 'Not Started').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Tracking</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor all courses and their completion status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.notStarted}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Not Started</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Courses ({filteredCourses.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(course.status)}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{course.code}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{course.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 dark:text-white font-medium">{course.credits}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {course.grade ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
