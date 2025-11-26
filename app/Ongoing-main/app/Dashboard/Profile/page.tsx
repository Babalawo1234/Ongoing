'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  UserIcon, 
  AcademicCapIcon, 
  EnvelopeIcon, 
  BookOpenIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    yearOfStudy: user?.yearOfStudy || '',
    catalogYear: user?.catalogYear || '',
    school: user?.school || '',
    course: user?.course || '',
    degreeType: user?.degreeType || '',
  });

  const handleEdit = () => {
    if (user) {
      setEditedData({
        name: user.name,
        email: user.email,
        studentId: user.studentId || '',
        yearOfStudy: user.yearOfStudy || '',
        catalogYear: user.catalogYear || '',
        school: user.school || '',
        course: user.course || '',
        degreeType: user.degreeType || '',
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!user) return;

    // Use the updateUser function from AuthContext
    const success = updateUser({
      name: editedData.name,
      email: editedData.email,
      yearOfStudy: editedData.yearOfStudy,
    });

    if (success) {
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Your personal and academic information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckIcon className="h-5 w-5" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-400 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-6" style={{ animationDelay: '0ms' }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <UserIcon className="h-12 w-12 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">{user.course || 'Student'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">{user.email}</p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              {user.role === 'admin' ? 'Administrator' : 'Student'}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6" style={{ animationDelay: '100ms' }}>
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <IdentificationIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            Personal Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
                  {user.name}
                </p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                  className="text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg break-all">
                  {user.email}
                </p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                <IdentificationIcon className="h-4 w-4 mr-2" />
                Student ID
              </label>
              <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
                {user.studentId || user.id}
              </p>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                Role
              </label>
              <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information - Only show for students with academic data */}
      {user.role === 'student' && (user.yearOfStudy || user.school || user.course) && (
        <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700" style={{ animationDelay: '200ms' }}>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <AcademicCapIcon className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Academic Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.yearOfStudy && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Year of Study
                  </label>
                  {isEditing ? (
                    <select
                      value={editedData.yearOfStudy}
                      onChange={(e) => setEditedData({ ...editedData, yearOfStudy: e.target.value })}
                      className="text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="500">500 Level</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
                      {user.yearOfStudy} Level
                    </p>
                  )}
                </div>
              )}
              {user.catalogYear && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Catalog Year
                  </label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
                    {user.catalogYear}
                  </p>
                </div>
              )}
              {user.school && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    <BuildingLibraryIcon className="h-4 w-4 mr-2" />
                    School of Study
                  </label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
                    School of {user.school}
                  </p>
                </div>
              )}
              {user.course && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    Course/Major
                  </label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
                    {user.course}
                  </p>
                </div>
              )}
              {user.degreeType && (
                <div className="group md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Degree Type
                  </label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
                    {user.degreeType}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
