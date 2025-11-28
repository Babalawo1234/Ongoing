/**
 * Shared Storage Utility
 * Provides real-time synchronization across Admin, Academic, and Student interfaces
 * using localStorage with custom event handling
 */

// Centralized storage keys
export const STORAGE_KEYS = {
  USERS: 'aun_checksheet_users',
  STUDENT_GRADES: 'student_grades',
  STUDENT_ACTIVITIES: 'student_activities',
  COURSES: 'courses',
  USER_COURSES_PREFIX: 'user_courses_',
} as const;

// Storage change event
export const STORAGE_CHANGE_EVENT = 'aun-storage-change';

/**
 * Get data from shared storage
 */
export function getSharedData<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Error reading from storage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set data to shared storage and trigger change event
 */
export function setSharedData<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    
    // Dispatch custom event to notify other components
    const event = new CustomEvent(STORAGE_CHANGE_EVENT, {
      detail: { key, value: serialized },
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error(`Error writing to storage key "${key}":`, error);
    return false;
  }
}

/**
 * Subscribe to storage changes
 */
export function subscribeToStorageChanges(
  callback: (key: string, value: string) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;
    callback(key, value);
  };
  
  window.addEventListener(STORAGE_CHANGE_EVENT, handler);
  
  // Also listen to native storage events (cross-tab)
  const storageHandler = (event: StorageEvent) => {
    if (event.key && event.newValue) {
      callback(event.key, event.newValue);
    }
  };
  window.addEventListener('storage', storageHandler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(STORAGE_CHANGE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Get user courses for a specific student
 */
export function getUserCourses(studentId: string): any[] {
  const key = `${STORAGE_KEYS.USER_COURSES_PREFIX}${studentId}`;
  return getSharedData(key, []);
}

/**
 * Set user courses for a specific student
 */
export function setUserCourses(studentId: string, courses: any[]): boolean {
  const key = `${STORAGE_KEYS.USER_COURSES_PREFIX}${studentId}`;
  return setSharedData(key, courses);
}

/**
 * Get all students
 */
export function getAllStudents(): any[] {
  const users = getSharedData(STORAGE_KEYS.USERS, []);
  return users.filter((u: any) => u.role === 'student');
}

/**
 * Get student grades
 */
export function getStudentGrades(studentId?: string): any[] {
  const allGrades = getSharedData(STORAGE_KEYS.STUDENT_GRADES, []);
  if (studentId) {
    return allGrades.filter((g: any) => g.studentId === studentId);
  }
  return allGrades;
}

/**
 * Calculate student progress
 */
export interface StudentProgress {
  creditsEarned: number;
  completed: number;
  enrolled: number;
  gpa: number;
}

export function calculateStudentProgress(studentId: string): StudentProgress {
  const courses = getUserCourses(studentId);
  const gradesFromStorage = getStudentGrades(studentId);
  
  // Check for grades in BOTH locations for backward compatibility
  const completed = courses.filter((c: any) => {
    // First check if grade exists in course object itself (student interface stores it here)
    if (c.grade && c.grade !== '') return true;
    
    // Then check student_grades storage (Admin/Academic expect it here)
    const gradeEntry = gradesFromStorage.find((g: any) => g.courseId === c.id);
    return gradeEntry && gradeEntry.grade && gradeEntry.grade !== '';
  });
  
  const enrolled = courses.filter((c: any) => {
    // Not completed if no grade in either location
    if (c.grade && c.grade !== '') return false;
    const gradeEntry = gradesFromStorage.find((g: any) => g.courseId === c.id);
    return !gradeEntry || !gradeEntry.grade || gradeEntry.grade === '';
  });
  
  const creditsEarned = completed.reduce((sum: number, c: any) => sum + (c.credits || 0), 0);
  
  // Calculate GPA
  const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
  let totalPoints = 0;
  let totalCredits = 0;
  
  completed.forEach((course: any) => {
    // Get grade from course object first, then from student_grades
    let grade = course.grade;
    if (!grade || grade === '') {
      const gradeEntry = gradesFromStorage.find((g: any) => g.courseId === course.id);
      grade = gradeEntry?.grade;
    }
    
    if (grade && gradePoints[grade] !== undefined) {
      totalPoints += gradePoints[grade] * (course.credits || 0);
      totalCredits += course.credits || 0;
    }
  });
  
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  
  return {
    creditsEarned,
    completed: completed.length,
    enrolled: enrolled.length,
    gpa,
  };
}

/**
 * Get system-wide statistics
 */
export interface SystemStats {
  totalStudents: number;
  totalCredits: number;
  totalCompleted: number;
  totalEnrolled: number;
  averageGPA: number;
}

export function getSystemStats(): SystemStats {
  const students = getAllStudents();
  
  let totalCredits = 0;
  let totalCompleted = 0;
  let totalEnrolled = 0;
  let totalGPA = 0;
  let studentsWithGPA = 0;
  
  students.forEach((student: any) => {
    const progress = calculateStudentProgress(student.id);
    totalCredits += progress.creditsEarned;
    totalCompleted += progress.completed;
    totalEnrolled += progress.enrolled;
    
    if (progress.gpa > 0) {
      totalGPA += progress.gpa;
      studentsWithGPA++;
    }
  });
  
  return {
    totalStudents: students.length,
    totalCredits,
    totalCompleted,
    totalEnrolled,
    averageGPA: studentsWithGPA > 0 ? totalGPA / studentsWithGPA : 0,
  };
}
