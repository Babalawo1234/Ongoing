// Course curriculum data loader - uses ONLY normalized database
// Old curricula folder is deprecated and removed

import { db } from './normalizedDatabase';

export interface CourseDefinition {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  semester?: number;
  elective?: boolean;
  completed: boolean;
  grade: string;
}

/**
 * Build COURSE_CURRICULA from normalized database ONLY
 * All courses are now stored in app/lib/data/normalized/courses.json
 */
function buildCourseCurricula(): Record<string, CourseDefinition[]> {
  const curricula: Record<string, CourseDefinition[]> = {};
  
  // Get all programs from normalized database
  const programs = db.getPrograms();
  
  programs.forEach(program => {
    // Get enriched courses for this program (includes program_course data)
    const enrichedCourses = db.getEnrichedCoursesForProgram(program.program_id);
    
    // Transform to CourseDefinition format for backward compatibility
    const courseDefs: CourseDefinition[] = enrichedCourses.map(course => {
      // Calculate level from year_required (1 = 100L, 2 = 200L, etc.)
      const level = `${course.year_required}00L`;
      
      return {
        id: `${course.course_code?.toLowerCase() || course.course_id}`,
        code: course.course_code || '',
        title: course.course_name || '',
        credits: course.credits || 0,
        level: level,
        semester: course.semester,
        elective: course.elective || false,
        completed: false,
        grade: '',
      };
    });
    
    // Store under program name
    curricula[program.program_name] = courseDefs;
  });
  
  return curricula;
}

// Build curricula dynamically from normalized database
export const COURSE_CURRICULA: Record<string, CourseDefinition[]> = buildCourseCurricula();

/**
 * Build SCHOOLS from normalized database departments
 */
function buildSchools(): Record<string, string[]> {
  const schools: Record<string, string[]> = {};
  const departments = db.getDepartments();
  
  departments.forEach(dept => {
    if (!schools[dept.school]) {
      schools[dept.school] = [];
    }
    schools[dept.school].push(dept.department_name);
  });
  
  return schools;
}

// School categorization built from normalized database
export const SCHOOLS = buildSchools();

// Function to initialize courses for a user based on their major
export function initializeUserCourses(userId: string, major: string, degreeType?: string): void {
  // Delegate to normalized database
  db.initializeStudentCourses(userId, major, degreeType);
  
  // Also save in old format for backward compatibility
  const userCoursesKey = `user_courses_${userId}`;
  
  // Check if user already has courses in old format
  const existingCourses = localStorage.getItem(userCoursesKey);
  if (existingCourses) {
    return; // Don't overwrite existing courses
  }

  // Get curriculum for the user's major
  const curriculum = COURSE_CURRICULA[major];
  if (!curriculum) {
    console.warn(`No curriculum found for major: ${major}`);
    return;
  }

  // Create a deep copy of the curriculum for this user
  const userCourses = JSON.parse(JSON.stringify(curriculum));
  
  // Save to localStorage
  localStorage.setItem(userCoursesKey, JSON.stringify(userCourses));
  console.log(`Initialized ${userCourses.length} courses for user ${userId} in major: ${major}`);
}

// Function to get user's courses
export function getUserCourses(userId: string): CourseDefinition[] {
  const userCoursesKey = `user_courses_${userId}`;
  const saved = localStorage.getItem(userCoursesKey);
  
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse user courses:', e);
      return [];
    }
  }
  
  return [];
}

// Function to update user's course progress
export function updateUserCourse(userId: string, courseId: string, updates: Partial<CourseDefinition>): boolean {
  const userCoursesKey = `user_courses_${userId}`;
  const courses = getUserCourses(userId);
  
  const updatedCourses = courses.map(course => 
    course.id === courseId ? { ...course, ...updates } : course
  );
  
  localStorage.setItem(userCoursesKey, JSON.stringify(updatedCourses));
  
  // Trigger storage event for real-time updates across components
  window.dispatchEvent(new Event('storage'));
  
  return true;
}

// Function to get available courses for a major (for preview)
export function getCoursesForMajor(major: string): CourseDefinition[] {
  return COURSE_CURRICULA[major] || [];
}

// Get all available majors
export function getAvailableMajors(): string[] {
  return Object.keys(COURSE_CURRICULA);
}

/**
 * Utility function to fix existing Master's students who might have Bachelor's courses
 * Call this from browser console: fixMastersStudentCourses()
 */
export function fixMastersStudentCourses(): void {
  if (typeof window === 'undefined') {
    console.log('This function can only be run in the browser');
    return;
  }

  const usersData = localStorage.getItem('aun_checksheet_users');
  if (!usersData) {
    console.log('No users found');
    return;
  }

  const users = JSON.parse(usersData);
  const mastersStudents = users.filter((user: any) => 
    user.degreeType && (user.degreeType.startsWith('M.') || user.degreeType.includes('Master'))
  );

  console.log(`Found ${mastersStudents.length} Master's students`);

  mastersStudents.forEach((student: any) => {
    console.log(`Fixing courses for ${student.name} (${student.course} - ${student.degreeType})`);
    db.forceReinitializeStudentCourses(student.id, student.course, student.degreeType);
  });

  console.log('Master\'s student courses have been fixed!');
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    fixMastersStudentCourses?: () => void;
  }
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  window.fixMastersStudentCourses = fixMastersStudentCourses;
}

// Get majors by school
export function getMajorsBySchool(school: string): string[] {
  return SCHOOLS[school as keyof typeof SCHOOLS] || [];
}

// Get school for a major
export function getSchoolForMajor(major: string): string | null {
  for (const [school, majors] of Object.entries(SCHOOLS)) {
    if (majors.includes(major)) {
      return school;
    }
  }
  return null;
}
