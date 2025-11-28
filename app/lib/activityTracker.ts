// Activity Tracker for Student Interface Actions
// Tracks what students do on their interface so admin/academic can see their progress

export interface StudentActivity {
  id: string;
  studentId: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface ActivitySummary {
  totalActivities: number;
  lastActive: string;
  coursesViewed: number;
  progressChecked: number;
  gradesViewed: number;
  checksheetUpdated: number;
  recentActivities: StudentActivity[];
}

export class ActivityTracker {
  private static STORAGE_KEY = 'student_activities';

  // Log a new activity
  static logActivity(studentId: string, action: string, description: string, metadata?: any): void {
    const activities = this.getActivities();
    
    const newActivity: StudentActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      action,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    };

    activities.push(newActivity);
    
    // Keep only last 1000 activities to prevent storage overflow
    if (activities.length > 1000) {
      activities.shift();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
  }

  // Get all activities
  static getActivities(): StudentActivity[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Get activities for a specific student
  static getStudentActivities(studentId: string): StudentActivity[] {
    return this.getActivities().filter(a => a.studentId === studentId);
  }

  // Get activity summary for a student
  static getActivitySummary(studentId: string): ActivitySummary {
    const activities = this.getStudentActivities(studentId);
    
    if (activities.length === 0) {
      return {
        totalActivities: 0,
        lastActive: 'Never',
        coursesViewed: 0,
        progressChecked: 0,
        gradesViewed: 0,
        checksheetUpdated: 0,
        recentActivities: [],
      };
    }

    // Sort by timestamp descending
    const sortedActivities = activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return {
      totalActivities: activities.length,
      lastActive: this.formatTimestamp(sortedActivities[0].timestamp),
      coursesViewed: activities.filter(a => a.action === 'VIEW_COURSE').length,
      progressChecked: activities.filter(a => a.action === 'VIEW_PROGRESS').length,
      gradesViewed: activities.filter(a => a.action === 'VIEW_GRADES').length,
      checksheetUpdated: activities.filter(a => a.action === 'UPDATE_CHECKSHEET').length,
      recentActivities: sortedActivities.slice(0, 20), // Last 20 activities
    };
  }

  // Format timestamp to readable format
  static formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get action icon/color for display
  static getActionStyle(action: string): { icon: string; color: string; bgColor: string } {
    const styles: { [key: string]: { icon: string; color: string; bgColor: string } } = {
      'VIEW_COURSE': { icon: '📚', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
      'VIEW_PROGRESS': { icon: '📊', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
      'VIEW_GRADES': { icon: '🎓', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
      'UPDATE_CHECKSHEET': { icon: '✏️', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
      'LOGIN': { icon: '🔐', color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
      'VIEW_DASHBOARD': { icon: '🏠', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700' },
      'ADD_COURSE': { icon: '➕', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
      'REMOVE_COURSE': { icon: '➖', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
      'CALCULATE_GPA': { icon: '🧮', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    };

    return styles[action] || { icon: '📝', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700' };
  }

  // Clear all activities (for testing/admin purposes)
  static clearActivities(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Clear activities for a specific student
  static clearStudentActivities(studentId: string): void {
    const activities = this.getActivities();
    const filtered = activities.filter(a => a.studentId !== studentId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}
