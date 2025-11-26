'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import AchievementsGrid from '@/app/components/AchievementsGrid';
import LevelDisplay from '@/app/components/LevelDisplay';

export default function AchievementsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          Achievements 🏆
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your academic accomplishments and unlock rewards
        </p>
      </div>

      {/* Level Display */}
      <div className="mb-8">
        <LevelDisplay userId={user.id} />
      </div>

      {/* Achievements Grid */}
      <AchievementsGrid userId={user.id} />
    </div>
  );
}
