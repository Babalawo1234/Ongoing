// Gamification System for AUN Checksheet
// Handles achievements, levels, streaks, and XP

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'academic' | 'progress' | 'social' | 'special';
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export interface GamificationData {
  userId: string;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  lastActivity: string;
  coursesCompleted: number;
  perfectGrades: number;
  creditsEarned: number;
}

// ==================== LEVEL SYSTEM ====================
export const LEVELS: UserLevel[] = [
  { level: 1, title: 'Freshman Starter', minXP: 0, maxXP: 100, color: 'from-gray-400 to-gray-600' },
  { level: 2, title: 'Eager Learner', minXP: 100, maxXP: 250, color: 'from-blue-400 to-blue-600' },
  { level: 3, title: 'Dedicated Student', minXP: 250, maxXP: 500, color: 'from-green-400 to-green-600' },
  { level: 4, title: 'Rising Scholar', minXP: 500, maxXP: 1000, color: 'from-purple-400 to-purple-600' },
  { level: 5, title: 'Academic Achiever', minXP: 1000, maxXP: 2000, color: 'from-yellow-400 to-yellow-600' },
  { level: 6, title: 'Honor Student', minXP: 2000, maxXP: 3500, color: 'from-orange-400 to-orange-600' },
  { level: 7, title: 'Excellence Pursuer', minXP: 3500, maxXP: 5000, color: 'from-red-400 to-red-600' },
  { level: 8, title: 'Dean\'s List Regular', minXP: 5000, maxXP: 7500, color: 'from-pink-400 to-pink-600' },
  { level: 9, title: 'Academic Elite', minXP: 7500, maxXP: 10000, color: 'from-indigo-400 to-indigo-600' },
  { level: 10, title: 'Master Scholar', minXP: 10000, maxXP: Infinity, color: 'from-yellow-500 to-orange-600' },
];

// ==================== ACHIEVEMENT DEFINITIONS ====================
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Academic Achievements
  {
    id: 'first_course',
    name: 'First Step',
    description: 'Complete your first course',
    icon: '🎯',
    category: 'academic',
    points: 50,
    maxProgress: 1
  },
  {
    id: 'perfect_grade',
    name: 'Perfect Score',
    description: 'Get an A grade in any course',
    icon: '⭐',
    category: 'academic',
    points: 100,
    maxProgress: 1
  },
  {
    id: 'five_courses',
    name: 'On a Roll',
    description: 'Complete 5 courses',
    icon: '🔥',
    category: 'progress',
    points: 150,
    maxProgress: 5
  },
  {
    id: 'ten_courses',
    name: 'Double Digits',
    description: 'Complete 10 courses',
    icon: '💯',
    category: 'progress',
    points: 250,
    maxProgress: 10
  },
  {
    id: 'twenty_courses',
    name: 'Halfway Hero',
    description: 'Complete 20 courses',
    icon: '🏆',
    category: 'progress',
    points: 500,
    maxProgress: 20
  },
  {
    id: 'all_a_semester',
    name: 'Perfect Semester',
    description: 'Get all A grades in a semester (6+ courses)',
    icon: '🌟',
    category: 'academic',
    points: 500,
    maxProgress: 1
  },
  {
    id: 'deans_list',
    name: 'Dean\'s List',
    description: 'Achieve a GPA of 4.5 or higher',
    icon: '👑',
    category: 'academic',
    points: 750,
    maxProgress: 1
  },
  {
    id: 'thirty_credits',
    name: 'Credit Hunter',
    description: 'Earn 30 credits',
    icon: '💰',
    category: 'progress',
    points: 200,
    maxProgress: 30
  },
  {
    id: 'sixty_credits',
    name: 'Halfway There',
    description: 'Earn 60 credits',
    icon: '🎓',
    category: 'progress',
    points: 400,
    maxProgress: 60
  },
  {
    id: 'ninety_credits',
    name: 'Final Stretch',
    description: 'Earn 90 credits',
    icon: '🚀',
    category: 'progress',
    points: 600,
    maxProgress: 90
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day login streak',
    icon: '📅',
    category: 'social',
    points: 100,
    maxProgress: 7
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day login streak',
    icon: '📆',
    category: 'social',
    points: 300,
    maxProgress: 30
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Log in before 8 AM five times',
    icon: '🌅',
    category: 'social',
    points: 150,
    maxProgress: 5
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Log in after 10 PM five times',
    icon: '🦉',
    category: 'social',
    points: 150,
    maxProgress: 5
  },
  {
    id: 'five_perfect',
    name: 'Excellence Streak',
    description: 'Get 5 A grades in a row',
    icon: '💎',
    category: 'academic',
    points: 400,
    maxProgress: 5
  },
  {
    id: 'no_failures',
    name: 'Clean Record',
    description: 'Complete 10 courses without any F grades',
    icon: '✨',
    category: 'academic',
    points: 350,
    maxProgress: 10
  },
  {
    id: 'graduation_ready',
    name: 'Graduation Ready',
    description: 'Earn 120 credits',
    icon: '🎊',
    category: 'special',
    points: 1000,
    maxProgress: 120
  },
];

// ==================== XP CALCULATION ====================
export function calculateXP(action: string, value?: number): number {
  const xpTable: Record<string, number> = {
    complete_course: 50,
    grade_a: 100,
    grade_b: 75,
    grade_c: 50,
    grade_d: 25,
    daily_login: 10,
    update_checksheet: 5,
    semester_complete: 200,
    gpa_above_4: 300,
  };
  
  return xpTable[action] || 0;
}

// ==================== GAMIFICATION MANAGER ====================
export class GamificationManager {
  private userId: string;
  private storageKey: string;

  constructor(userId: string) {
    this.userId = userId;
    this.storageKey = `gamification_${userId}`;
  }

  // Initialize gamification data for new user
  initializeUser(): GamificationData {
    const data: GamificationData = {
      userId: this.userId,
      totalXP: 0,
      level: 1,
      achievements: ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        unlocked: false,
        progress: 0
      })),
      streak: 0,
      lastActivity: new Date().toISOString(),
      coursesCompleted: 0,
      perfectGrades: 0,
      creditsEarned: 0,
    };

    this.saveData(data);
    return data;
  }

  // Get user's gamification data
  getData(): GamificationData {
    if (typeof window === 'undefined') return this.initializeUser();
    
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return this.initializeUser();
    
    return JSON.parse(saved);
  }

  // Save gamification data
  private saveData(data: GamificationData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Add XP and check for level up
  addXP(amount: number): { levelUp: boolean; newLevel?: number } {
    const data = this.getData();
    data.totalXP += amount;
    
    const currentLevel = this.getCurrentLevel(data.totalXP);
    const levelUp = currentLevel.level > data.level;
    
    if (levelUp) {
      data.level = currentLevel.level;
    }
    
    this.saveData(data);
    
    return {
      levelUp,
      newLevel: levelUp ? currentLevel.level : undefined
    };
  }

  // Get current level based on XP
  getCurrentLevel(xp: number): UserLevel {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].minXP) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  }

  // Get XP progress to next level
  getXPProgress(): { current: number; required: number; percentage: number } {
    const data = this.getData();
    const currentLevel = this.getCurrentLevel(data.totalXP);
    const nextLevel = LEVELS[currentLevel.level]; // Next level (index = current level)
    
    if (!nextLevel) {
      return { current: data.totalXP, required: currentLevel.maxXP, percentage: 100 };
    }
    
    const current = data.totalXP - currentLevel.minXP;
    const required = nextLevel.minXP - currentLevel.minXP;
    const percentage = (current / required) * 100;
    
    return { current, required, percentage };
  }

  // Update streak
  updateStreak(): number {
    const data = this.getData();
    const now = new Date();
    const lastActivity = new Date(data.lastActivity);
    
    const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change
      return data.streak;
    } else if (daysDiff === 1) {
      // Next day, increment streak
      data.streak += 1;
      this.addXP(calculateXP('daily_login'));
    } else {
      // Streak broken
      data.streak = 1;
    }
    
    data.lastActivity = now.toISOString();
    this.saveData(data);
    
    // Check streak achievements
    this.checkAchievement('streak_7', data.streak);
    this.checkAchievement('streak_30', data.streak);
    
    return data.streak;
  }

  // Check and unlock achievement
  checkAchievement(achievementId: string, progress: number): Achievement | null {
    const data = this.getData();
    const achievement = data.achievements.find(a => a.id === achievementId);
    
    if (!achievement || achievement.unlocked) return null;
    
    achievement.progress = Math.min(progress, achievement.maxProgress);
    
    if (achievement.progress >= achievement.maxProgress) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      this.addXP(achievement.points);
      this.saveData(data);
      return achievement;
    }
    
    this.saveData(data);
    return null;
  }

  // Process course completion
  processCourseCompletion(grade: string, credits: number): Achievement[] {
    const data = this.getData();
    const unlockedAchievements: Achievement[] = [];
    
    // Update stats
    data.coursesCompleted += 1;
    data.creditsEarned += credits;
    if (grade === 'A') data.perfectGrades += 1;
    
    // Add XP based on grade
    const gradeXP = calculateXP(`grade_${grade.toLowerCase()}`);
    this.addXP(gradeXP + calculateXP('complete_course'));
    
    // Check achievements
    const checks = [
      { id: 'first_course', progress: data.coursesCompleted },
      { id: 'five_courses', progress: data.coursesCompleted },
      { id: 'ten_courses', progress: data.coursesCompleted },
      { id: 'twenty_courses', progress: data.coursesCompleted },
      { id: 'thirty_credits', progress: data.creditsEarned },
      { id: 'sixty_credits', progress: data.creditsEarned },
      { id: 'ninety_credits', progress: data.creditsEarned },
      { id: 'graduation_ready', progress: data.creditsEarned },
    ];
    
    if (grade === 'A') {
      checks.push({ id: 'perfect_grade', progress: data.perfectGrades });
      checks.push({ id: 'five_perfect', progress: data.perfectGrades });
    }
    
    checks.forEach(check => {
      const unlocked = this.checkAchievement(check.id, check.progress);
      if (unlocked) unlockedAchievements.push(unlocked);
    });
    
    this.saveData(data);
    return unlockedAchievements;
  }

  // Get leaderboard data
  static getLeaderboard(limit = 10): Array<{ name: string; xp: number; level: number; userId: string }> {
    if (typeof window === 'undefined') return [];
    
    const leaderboard: Array<{ name: string; xp: number; level: number; userId: string }> = [];
    
    // Get all users
    const usersData = localStorage.getItem('aun_checksheet_users');
    if (!usersData) return [];
    
    const users = JSON.parse(usersData);
    
    users.forEach((user: any) => {
      const gamData = localStorage.getItem(`gamification_${user.id}`);
      if (gamData) {
        const data: GamificationData = JSON.parse(gamData);
        leaderboard.push({
          name: user.name,
          xp: data.totalXP,
          level: data.level,
          userId: user.id
        });
      }
    });
    
    // Sort by XP descending
    leaderboard.sort((a, b) => b.xp - a.xp);
    
    return leaderboard.slice(0, limit);
  }
}

// Export helper function
export function getGamificationManager(userId: string): GamificationManager {
  return new GamificationManager(userId);
}
