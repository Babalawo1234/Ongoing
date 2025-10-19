'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { AcademicCapIcon, ChartBarIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'academic') {
        router.replace('/academic');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900 transition-theme">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AUN Academic Check Sheet</span>
            </div>
            <Link href="/login">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                Login
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your Academic
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Journey</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Manage your courses, monitor progress, and achieve your academic goals with our comprehensive check sheet system.
          </p>
          <Link href="/login">
            <button className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700">
            <div className="inline-block p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 mb-4">
              <ChartBarIcon className="h-12 w-12 text-white mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor your academic progress with detailed analytics and GPA calculations.</p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700">
            <div className="inline-block p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
              <BookOpenIcon className="h-12 w-12 text-white mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Course Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Organize courses by semester and track completion status with ease.</p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700">
            <div className="inline-block p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
              <AcademicCapIcon className="h-12 w-12 text-white mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Grade Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Assign and track grades with automatic GPA calculations.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
