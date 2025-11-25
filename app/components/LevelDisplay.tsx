'use client';

import { TrophyIcon, FireIcon } from '@heroicons/react/24/outline';
import { GamificationManager, LEVELS } from '@/app/lib/gamification';
import { useEffect, useState } from 'react';

interface LevelDisplayProps {
  userId: string;
  compact?: boolean;
}

export default function LevelDisplay({ userId, compact = false }: LevelDisplayProps) {
  const [data, setData] = useState<any>(null);
  const [xpProgress, setXpProgress] = useState({ current: 0, required: 0, percentage: 0 });

  useEffect(() => {
    const manager = new GamificationManager(userId);
    const gamData = manager.getData();
    const progress = manager.getXPProgress();
    
    setData(gamData);
    setXpProgress(progress);
  }, [userId]);

  if (!data) return null;

  const currentLevel = LEVELS[data.level - 1] || LEVELS[0];
  const nextLevel = LEVELS[data.level] || null;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-white font-bold shadow-lg`}>
          {data.level}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Level {data.level}: {currentLevel.title}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all duration-500`}
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {data.totalXP} XP
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Level</h3>
        <TrophyIcon className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
          {data.level}
        </div>
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentLevel.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.totalXP.toLocaleString()} Total XP
          </p>
        </div>
      </div>

      {nextLevel && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Progress to Level {data.level + 1}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.round(xpProgress.percentage)}%
            </span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all duration-500 relative`}
              style={{ width: `${xpProgress.percentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {xpProgress.current.toLocaleString()} / {xpProgress.required.toLocaleString()} XP
          </p>
        </div>
      )}

      {/* Streak Display */}
      {data.streak > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <FireIcon className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.streak} Days
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Login Streak 🔥
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
