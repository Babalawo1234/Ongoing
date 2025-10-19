// Course curriculum data by major/course

export interface CourseDefinition {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  completed: boolean;
  grade: string;
}

// Define curricula for different majors
export const COURSE_CURRICULA: Record<string, CourseDefinition[]> = {
  // Engineering Courses
  'Petroleum Engineering': [
    // 100L
    { id: 'pe-101', code: 'PET101', title: 'Introduction to Petroleum Engineering', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'pe-102', code: 'CHM101', title: 'General Chemistry I', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'pe-103', code: 'MTH101', title: 'Calculus I', credits: 4, level: '100L', completed: false, grade: '' },
    { id: 'pe-104', code: 'PHY101', title: 'Physics I', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'pe-105', code: 'ENG101', title: 'English Composition', credits: 3, level: '100L', completed: false, grade: '' },
    // 200L
    { id: 'pe-201', code: 'PET201', title: 'Reservoir Engineering', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'pe-202', code: 'PET202', title: 'Drilling Engineering', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'pe-203', code: 'MTH201', title: 'Differential Equations', credits: 3, level: '200L', completed: false, grade: '' },
    { id: 'pe-204', code: 'CHM201', title: 'Organic Chemistry', credits: 3, level: '200L', completed: false, grade: '' },
    // 300L
    { id: 'pe-301', code: 'PET301', title: 'Production Engineering', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'pe-302', code: 'PET302', title: 'Petroleum Geology', credits: 3, level: '300L', completed: false, grade: '' },
    { id: 'pe-303', code: 'PET303', title: 'Well Testing', credits: 3, level: '300L', completed: false, grade: '' },
    // 400L
    { id: 'pe-401', code: 'PET401', title: 'Enhanced Oil Recovery', credits: 4, level: '400L', completed: false, grade: '' },
    { id: 'pe-402', code: 'PET402', title: 'Petroleum Economics', credits: 3, level: '400L', completed: false, grade: '' },
  ],

  'Chemical Engineering': [
    // 100L
    { id: 'che-101', code: 'CHE101', title: 'Introduction to Chemical Engineering', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'che-102', code: 'CHM101', title: 'General Chemistry I', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'che-103', code: 'MTH101', title: 'Calculus I', credits: 4, level: '100L', completed: false, grade: '' },
    { id: 'che-104', code: 'PHY101', title: 'Physics I', credits: 3, level: '100L', completed: false, grade: '' },
    // 200L
    { id: 'che-201', code: 'CHE201', title: 'Chemical Engineering Thermodynamics', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'che-202', code: 'CHE202', title: 'Fluid Mechanics', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'che-203', code: 'CHM201', title: 'Organic Chemistry', credits: 3, level: '200L', completed: false, grade: '' },
    // 300L
    { id: 'che-301', code: 'CHE301', title: 'Heat Transfer', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'che-302', code: 'CHE302', title: 'Mass Transfer', credits: 4, level: '300L', completed: false, grade: '' },
    // 400L
    { id: 'che-401', code: 'CHE401', title: 'Process Control', credits: 4, level: '400L', completed: false, grade: '' },
    { id: 'che-402', code: 'CHE402', title: 'Plant Design', credits: 3, level: '400L', completed: false, grade: '' },
  ],

  'Computer Science': [
    // 100L
    { id: 'cs-101', code: 'CSC101', title: 'Introduction to Computer Science', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'cs-102', code: 'CSC102', title: 'Programming Fundamentals', credits: 4, level: '100L', completed: false, grade: '' },
    { id: 'cs-103', code: 'MTH101', title: 'Calculus I', credits: 4, level: '100L', completed: false, grade: '' },
    { id: 'cs-104', code: 'MTH111', title: 'Discrete Mathematics', credits: 3, level: '100L', completed: false, grade: '' },
    // 200L
    { id: 'cs-201', code: 'CSC201', title: 'Data Structures', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'cs-202', code: 'CSC202', title: 'Algorithms', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'cs-203', code: 'CSC203', title: 'Object-Oriented Programming', credits: 3, level: '200L', completed: false, grade: '' },
    // 300L
    { id: 'cs-301', code: 'CSC301', title: 'Database Systems', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'cs-302', code: 'CSC302', title: 'Operating Systems', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'cs-303', code: 'CSC303', title: 'Computer Networks', credits: 3, level: '300L', completed: false, grade: '' },
    // 400L
    { id: 'cs-401', code: 'CSC401', title: 'Software Engineering', credits: 4, level: '400L', completed: false, grade: '' },
    { id: 'cs-402', code: 'CSC402', title: 'Artificial Intelligence', credits: 3, level: '400L', completed: false, grade: '' },
  ],

  'Accounting': [
    // 100L
    { id: 'acc-101', code: 'ACC101', title: 'Principles of Accounting I', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'acc-102', code: 'ECO101', title: 'Microeconomics', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'acc-103', code: 'BUS101', title: 'Introduction to Business', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'acc-104', code: 'MTH101', title: 'Business Mathematics', credits: 3, level: '100L', completed: false, grade: '' },
    // 200L
    { id: 'acc-201', code: 'ACC201', title: 'Intermediate Accounting I', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'acc-202', code: 'ACC202', title: 'Cost Accounting', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'acc-203', code: 'FIN201', title: 'Corporate Finance', credits: 3, level: '200L', completed: false, grade: '' },
    // 300L
    { id: 'acc-301', code: 'ACC301', title: 'Advanced Accounting', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'acc-302', code: 'ACC302', title: 'Auditing', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'acc-303', code: 'TAX301', title: 'Taxation', credits: 3, level: '300L', completed: false, grade: '' },
    // 400L
    { id: 'acc-401', code: 'ACC401', title: 'Financial Statement Analysis', credits: 4, level: '400L', completed: false, grade: '' },
    { id: 'acc-402', code: 'ACC402', title: 'International Accounting', credits: 3, level: '400L', completed: false, grade: '' },
  ],

  'Mass Communication': [
    // 100L
    { id: 'mc-101', code: 'COM101', title: 'Introduction to Mass Communication', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'mc-102', code: 'ENG101', title: 'English Composition', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'mc-103', code: 'COM102', title: 'Media Writing', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'mc-104', code: 'SOC101', title: 'Introduction to Sociology', credits: 3, level: '100L', completed: false, grade: '' },
    // 200L
    { id: 'mc-201', code: 'COM201', title: 'Journalism', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'mc-202', code: 'COM202', title: 'Broadcasting', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'mc-203', code: 'COM203', title: 'Public Relations', credits: 3, level: '200L', completed: false, grade: '' },
    // 300L
    { id: 'mc-301', code: 'COM301', title: 'Digital Media', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'mc-302', code: 'COM302', title: 'Media Law & Ethics', credits: 3, level: '300L', completed: false, grade: '' },
    { id: 'mc-303', code: 'COM303', title: 'Advertising', credits: 3, level: '300L', completed: false, grade: '' },
    // 400L
    { id: 'mc-401', code: 'COM401', title: 'Media Management', credits: 4, level: '400L', completed: false, grade: '' },
    { id: 'mc-402', code: 'COM402', title: 'Research Methods', credits: 3, level: '400L', completed: false, grade: '' },
  ],

  'Economics': [
    // 100L
    { id: 'eco-101', code: 'ECO101', title: 'Microeconomics', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'eco-102', code: 'ECO102', title: 'Macroeconomics', credits: 3, level: '100L', completed: false, grade: '' },
    { id: 'eco-103', code: 'MTH101', title: 'Mathematics for Economists', credits: 4, level: '100L', completed: false, grade: '' },
    { id: 'eco-104', code: 'STA101', title: 'Introduction to Statistics', credits: 3, level: '100L', completed: false, grade: '' },
    // 200L
    { id: 'eco-201', code: 'ECO201', title: 'Intermediate Microeconomics', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'eco-202', code: 'ECO202', title: 'Intermediate Macroeconomics', credits: 4, level: '200L', completed: false, grade: '' },
    { id: 'eco-203', code: 'ECO203', title: 'Econometrics I', credits: 4, level: '200L', completed: false, grade: '' },
    // 300L
    { id: 'eco-301', code: 'ECO301', title: 'International Economics', credits: 4, level: '300L', completed: false, grade: '' },
    { id: 'eco-302', code: 'ECO302', title: 'Development Economics', credits: 3, level: '300L', completed: false, grade: '' },
    { id: 'eco-303', code: 'ECO303', title: 'Public Finance', credits: 3, level: '300L', completed: false, grade: '' },
    // 400L
    { id: 'eco-401', code: 'ECO401', title: 'Monetary Economics', credits: 4, level: '400L', completed: false, grade: '' },
    { id: 'eco-402', code: 'ECO402', title: 'Economic Policy', credits: 3, level: '400L', completed: false, grade: '' },
  ],
};

// Function to initialize courses for a user based on their major
export function initializeUserCourses(userId: string, major: string): void {
  const userCoursesKey = `user_courses_${userId}`;
  
  // Check if user already has courses
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

// Function to get available courses for a major (for preview)
export function getCoursesForMajor(major: string): CourseDefinition[] {
  return COURSE_CURRICULA[major] || [];
}

// Get all available majors
export function getAvailableMajors(): string[] {
  return Object.keys(COURSE_CURRICULA);
}
