'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { GamificationManager, type GamificationData } from '@/app/lib/gamification';

interface AchievementsGridProps {
  userId: string;
}

export default function AchievementsGrid({ userId }: AchievementsGridProps) {
  const { user } = useAuth();
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const manager = new GamificationManager(userId);

    const loadData = () => {
      const gamData = manager.getData();
      setData(gamData);
      setLoading(false);
    };

    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('gamification_update', handleUpdate);
    
    return () => {
      window.removeEventListener('gamification_update', handleUpdate);
    };
  }, [userId]);

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      academic: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 text-blue-600 dark:text-blue-400',
      progress: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 text-green-600 dark:text-green-400',
      social: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 text-purple-600 dark:text-purple-400',
      special: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 text-yellow-600 dark:text-yellow-400',
    };
    return colorMap[category] || colorMap.academic;
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unlockedCount = data.achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <p className="text-xs sm:text-sm opacity-90 mb-2">Level</p>
          <p className="text-2xl sm:text-3xl font-bold">{data.level}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <p className="text-xs sm:text-sm opacity-90 mb-2">Completed Courses</p>
          <p className="text-2xl sm:text-3xl font-bold">{data.coursesCompleted}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <p className="text-xs sm:text-sm opacity-90 mb-2">Credits Earned</p>
          <p className="text-2xl sm:text-3xl font-bold">{data.creditsEarned}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <p className="text-xs sm:text-sm opacity-90 mb-2">Total XP</p>
          <p className="text-2xl sm:text-3xl font-bold">{data.totalXP}</p>
        </div>
      </div>

      {/* Achievement Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Achievements</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {unlockedCount} / {data.achievements.length} unlocked
        </span>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {data.achievements.map((achievement) => {
          const progress = (achievement.progress / achievement.maxProgress) * 100;
          
          return (
            <div
              key={achievement.id}
              className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br border-2 ${
                achievement.unlocked ? 'border-transparent shadow-lg' : 'border-gray-200 dark:border-gray-700 opacity-75 grayscale'
              } ${getCategoryColor(achievement.category)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold mb-1">{achievement.name}</h3>
                  <p className="text-xs sm:text-sm opacity-80">{achievement.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="text-2xl sm:text-3xl">{achievement.icon}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs sm:text-sm">Progress</span>
                  <span className="font-bold text-lg sm:text-xl">
                    {achievement.progress} / {achievement.maxProgress}
                  </span>
                </div>
                
                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
                  <div
                    className="bg-current h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {achievement.unlocked && (
                <div className="mt-4 text-xs font-bold flex items-center gap-1">
                  <span>✨ Unlocked</span>
                  {achievement.unlockedAt && (
                    <span className="opacity-75">
                       on {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}