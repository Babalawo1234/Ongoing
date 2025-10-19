'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleEdit = () => {
    if (user) {
      setEditedData({
        name: user.name,
        email: user.email,
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!user) return;

    // Update user in localStorage
    const storedUsers = localStorage.getItem('aun_checksheet_users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            name: editedData.name,
            email: editedData.email,
          };
        }
        return u;
      });
      localStorage.setItem('aun_checksheet_users', JSON.stringify(updatedUsers));

      // Update current session
      const currentUser = {
        ...user,
        name: editedData.name,
        email: editedData.email,
      };
      sessionStorage.setItem('aun_checksheet_current_user', JSON.stringify(currentUser));
      
      // Force page reload to update user context
      window.location.reload();
    }
    
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="mt-2 text-gray-600">Manage your administrator account</p>
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
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-8 border border-gray-200 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <ShieldCheckIcon className="h-12 w-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
            <p className="text-lg text-gray-600 mb-1">{user.email}</p>
            <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              System Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="text-lg font-medium text-gray-900 bg-white border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                  {user.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                  className="text-lg font-medium text-gray-900 bg-white border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-lg break-all">
                  {user.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Role
              </label>
              <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                Administrator
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                User ID
              </label>
              <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-lg font-mono">
                {user.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
