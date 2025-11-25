'use client';

import { useEffect, useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { GamificationManager } from '@/app/lib/gamification';
import type { Achievement } from '@/app/lib/gamification';

interface AchievementsGridProps {
  userId: string;
}

export default function AchievementsGrid({ userId }: AchievementsGridProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const manager = new GamificationManager(userId);
    const data = manager.getData();
    setAchievements(data.achievements);
  }, [userId]);

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Achievements Unlocked</p>
          <p className="text-3xl font-bold">
            {unlockedCount} / {achievements.length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Total Points Earned</p>
          <p className="text-3xl font-bold">{totalPoints.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Completion Rate</p>
          <p className="text-3xl font-bold">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All ({achievements.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unlocked'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Unlocked ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'locked'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Locked ({achievements.length - unlockedCount})
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700 hover:shadow-lg'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
            }`}
          >
            {/* Icon */}
            <div className="flex items-start justify-between mb-3">
              <div
                className={`text-5xl ${
                  achievement.unlocked ? 'animate-bounce' : 'grayscale opacity-50'
                }`}
              >
                {achievement.icon}
              </div>
              {!achievement.unlocked && (
                <LockClosedIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white">
                {achievement.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.unlocked && achievement.maxProgress > 1 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                      style={{
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase">
                  {achievement.category}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  +{achievement.points} XP
                </span>
              </div>

              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
