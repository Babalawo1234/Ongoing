'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, TrophyIcon } from '@heroicons/react/24/outline';
import type { Achievement } from '@/app/lib/gamification';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setShow(true), 100);

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-1 rounded-2xl shadow-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">{achievement.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Achievement Unlocked!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  +{achievement.points} XP
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {achievement.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {achievement.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrophyIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                {achievement.category.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(achievement.unlockedAt || '').toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
