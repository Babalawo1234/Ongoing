'use client';

import { useEffect, useState } from 'react';
import { TrophyIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { GamificationManager, LEVELS } from '@/app/lib/gamification';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  const loadLeaderboard = () => {
    const data = GamificationManager.getLeaderboard(50);
    setLeaderboard(data);
    
    if (user) {
      const rank = data.findIndex(entry => entry.userId === user.id);
      setUserRank(rank + 1);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-200 to-gray-400';
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          Leaderboard 🏆
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          See how you rank against other students
        </p>
      </div>

      {/* Your Rank Card */}
      {userRank > 0 && (
        <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Your Current Rank</p>
              <p className="text-5xl font-bold">#{userRank}</p>
              <p className="text-sm opacity-90 mt-2">
                {leaderboard[userRank - 1]?.xp.toLocaleString()} XP
              </p>
            </div>
            <div className="text-6xl">
              {getRankIcon(userRank)}
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* 2nd Place */}
            <div className="transform translate-y-4">
              <div className="bg-gradient-to-r from-gray-300 to-gray-500 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-2">🥈</div>
                <h3 className="font-bold text-white text-lg truncate">
                  {leaderboard[1].name}
                </h3>
                <p className="text-white/90 text-sm">Level {leaderboard[1].level}</p>
                <p className="text-white font-semibold mt-2">
                  {leaderboard[1].xp.toLocaleString()} XP
                </p>
              </div>
            </div>

            {/* 1st Place */}
            <div>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8 text-center shadow-2xl transform scale-105">
                <div className="text-6xl mb-3 animate-bounce">👑</div>
                <h3 className="font-bold text-white text-xl truncate">
                  {leaderboard[0].name}
                </h3>
                <p className="text-white/90">Level {leaderboard[0].level}</p>
                <p className="text-white font-bold text-lg mt-2">
                  {leaderboard[0].xp.toLocaleString()} XP
                </p>
                <div className="mt-3 flex justify-center">
                  <SparklesIcon className="w-6 h-6 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="transform translate-y-8">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-2">🥉</div>
                <h3 className="font-bold text-white text-lg truncate">
                  {leaderboard[2].name}
                </h3>
                <p className="text-white/90 text-sm">Level {leaderboard[2].level}</p>
                <p className="text-white font-semibold mt-2">
                  {leaderboard[2].xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Rankings
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            const level = LEVELS[entry.level - 1] || LEVELS[0];
            const isCurrentUser = user && entry.userId === user.id;

            return (
              <div
                key={entry.userId}
                className={`p-4 flex items-center gap-4 transition-colors ${
                  isCurrentUser
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {/* Rank */}
                <div className="w-16 text-center">
                  {rank <= 3 ? (
                    <span className="text-3xl">{getRankIcon(rank)}</span>
                  ) : (
                    <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
                      #{rank}
                    </span>
                  )}
                </div>

                {/* Level Badge */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center text-white font-bold shadow-md`}
                >
                  {entry.level}
                </div>

                {/* Name and Level */}
                <div className="flex-1">
                  <h3 className={`font-bold ${
                    isCurrentUser
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {level.title}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {entry.xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">XP</p>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="p-12 text-center">
            <TrophyIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No rankings yet. Be the first to earn XP!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
