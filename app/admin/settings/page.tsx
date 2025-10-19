'use client';

import { useState, useEffect } from 'react';
import { useDarkMode } from '@/app/contexts/DarkModeContext';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'data' | 'appearance'>('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    institutionName: 'American University of Nigeria',
    academicYear: '2024-2025',
    defaultSemester: 'Fall',
    gradeScale: '5.0',
    minimumPassingGrade: 'D',
    enableNotifications: true,
    enableEmailAlerts: false,
    enableGradeRelease: true,
    requireStrongPassword: true,
    sessionTimeout: '30',
    enableAutoBackup: false,
    backupFrequency: 'weekly',
  });

  // Dark mode is now managed by DarkModeContext

  const handleSave = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearData = (dataType: string) => {
    if (confirm(`Are you sure you want to clear all ${dataType}? This action cannot be undone.`)) {
      if (dataType === 'students') {
        const users = JSON.parse(localStorage.getItem('aun_checksheet_users') || '[]');
        const nonStudents = users.filter((u: any) => u.role !== 'student');
        localStorage.setItem('aun_checksheet_users', JSON.stringify(nonStudents));
      } else if (dataType === 'courses') {
        localStorage.removeItem('admin_courses');
      } else if (dataType === 'grades') {
        localStorage.removeItem('student_grades');
      } else if (dataType === 'all') {
        localStorage.removeItem('admin_courses');
        localStorage.removeItem('student_grades');
        const users = JSON.parse(localStorage.getItem('aun_checksheet_users') || '[]');
        const nonStudents = users.filter((u: any) => u.role !== 'student');
        localStorage.setItem('aun_checksheet_users', JSON.stringify(nonStudents));
      }
      alert(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data cleared successfully!`);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'data', name: 'Data Management', icon: DocumentTextIcon },
    { id: 'appearance', name: 'Appearance', icon: isDarkMode ? MoonIcon : SunIcon },
  ] as const;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Configure system-wide settings and preferences</p>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          <p className="text-green-800 dark:text-green-400 font-medium">Settings saved successfully!</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={settings.institutionName}
                  onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                  className="w-full max-w-2xl px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="2024-2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Semester
                  </label>
                  <select
                    value={settings.defaultSemester}
                    onChange={(e) => setSettings({ ...settings, defaultSemester: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Scale
                  </label>
                  <select
                    value={settings.gradeScale}
                    onChange={(e) => setSettings({ ...settings, gradeScale: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="5.0">5.0 Scale</option>
                    <option value="4.0">4.0 Scale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Passing Grade
                  </label>
                  <select
                    value={settings.minimumPassingGrade}
                    onChange={(e) => setSettings({ ...settings, minimumPassingGrade: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="D">D</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Enable Notifications</h3>
                  <p className="text-sm text-gray-500">Receive system notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Alerts</h3>
                  <p className="text-sm text-gray-500">Send email notifications for important events</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableEmailAlerts}
                  onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Grade Release Notifications</h3>
                  <p className="text-sm text-gray-500">Notify students when grades are released</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableGradeRelease}
                  onChange={(e) => setSettings({ ...settings, enableGradeRelease: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Require Strong Passwords</h3>
                  <p className="text-sm text-gray-500">Enforce password complexity requirements</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireStrongPassword}
                  onChange={(e) => setSettings({ ...settings, requireStrongPassword: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="5"
                  max="120"
                />
                <p className="mt-1 text-sm text-gray-500">Users will be logged out after this period of inactivity</p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Data management operations are irreversible. Please proceed with caution.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Clear Student Data</h3>
                    <p className="text-sm text-gray-500">Remove all student records from the system</p>
                  </div>
                  <button
                    onClick={() => handleClearData('students')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Clear Students
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Clear Course Data</h3>
                    <p className="text-sm text-gray-500">Remove all courses from the system</p>
                  </div>
                  <button
                    onClick={() => handleClearData('courses')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Clear Courses
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Clear Grade Data</h3>
                    <p className="text-sm text-gray-500">Remove all grades from the system</p>
                  </div>
                  <button
                    onClick={() => handleClearData('grades')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Clear Grades
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <h3 className="text-sm font-medium text-red-900">Clear All Data</h3>
                    <p className="text-sm text-red-700">Remove all students, courses, and grades</p>
                  </div>
                  <button
                    onClick={() => handleClearData('all')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    {isDarkMode ? (
                      <MoonIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <SunIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isDarkMode ? 'Dark mode is currently enabled' : 'Light mode is currently enabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-11' : 'translate-x-1'
                    }`}
                  >
                    {isDarkMode ? (
                      <MoonIcon className="h-8 w-8 p-1.5 text-indigo-600" />
                    ) : (
                      <SunIcon className="h-8 w-8 p-1.5 text-gray-600" />
                    )}
                  </span>
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Preview</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The theme will apply across the entire admin interface. Your preference is saved automatically.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
