export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: 100 | 200 | 300 | 400;
  isCompleted: boolean;
  grade?: Grade;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface GradePoint {
  grade: Grade;
  points: number;
}

export interface AcademicProgress {
  totalCredits: number;
  completedCredits: number;
  gpa: number;
  completionPercentage: number;
  coursesByLevel: {
    [key: number]: Course[];
  };
}

export interface AcademicStats {
  totalCourses: number;
  completedCourses: number;
  averageGradeByLevel: {
    [key: number]: number;
  };
  creditsByLevel: {
    [key: number]: { total: number; completed: number };
  };
}

export const GRADE_POINTS: Record<Grade, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

export const SAMPLE_COURSES: Course[] = [
  // 100 Level Courses
  { id: '1', code: 'CSC 101', title: 'Introduction to Computer Science', credits: 3, level: 100, isCompleted: false },
  { id: '2', code: 'MTH 101', title: 'General Mathematics I', credits: 3, level: 100, isCompleted: false },
  { id: '3', code: 'PHY 101', title: 'General Physics I', credits: 3, level: 100, isCompleted: false },
  { id: '4', code: 'CHM 101', title: 'General Chemistry I', credits: 3, level: 100, isCompleted: false },
  
  // 200 Level Courses
  { id: '5', code: 'CSC 201', title: 'Computer Programming I', credits: 3, level: 200, isCompleted: false },
  { id: '6', code: 'CSC 203', title: 'Discrete Mathematics', credits: 3, level: 200, isCompleted: false },
  { id: '7', code: 'MTH 201', title: 'Mathematical Methods I', credits: 3, level: 200, isCompleted: false },
  { id: '8', code: 'STA 201', title: 'Statistics for Physical Sciences', credits: 3, level: 200, isCompleted: false },
  { id: '9', code: 'CSC 205', title: 'Computer Programming II', credits: 3, level: 200, isCompleted: false },
  { id: '10', code: 'CSC 207', title: 'Digital Logic Design', credits: 3, level: 200, isCompleted: false },
  
  // 300 Level Courses
  { id: '11', code: 'CSC 301', title: 'Data Structures and Algorithms', credits: 4, level: 300, isCompleted: false },
  { id: '12', code: 'CSC 303', title: 'Operating Systems', credits: 3, level: 300, isCompleted: false },
  { id: '13', code: 'CSC 305', title: 'Database Management Systems', credits: 3, level: 300, isCompleted: false },
  { id: '14', code: 'CSC 307', title: 'Software Engineering', credits: 3, level: 300, isCompleted: false },
  { id: '15', code: 'CSC 309', title: 'Computer Networks', credits: 3, level: 300, isCompleted: false },
  { id: '16', code: 'CSC 311', title: 'Artificial Intelligence', credits: 4, level: 300, isCompleted: false },
  { id: '17', code: 'CSC 313', title: 'Web Technologies', credits: 3, level: 300, isCompleted: false },
  
  // 400 Level Courses
  { id: '18', code: 'CSC 401', title: 'Advanced Algorithms', credits: 4, level: 400, isCompleted: false },
  { id: '19', code: 'CSC 403', title: 'Machine Learning', credits: 4, level: 400, isCompleted: false },
  { id: '20', code: 'CSC 405', title: 'Computer Graphics', credits: 3, level: 400, isCompleted: false },
  { id: '21', code: 'CSC 407', title: 'Cybersecurity', credits: 3, level: 400, isCompleted: false },
  { id: '22', code: 'CSC 499', title: 'Final Year Project', credits: 6, level: 400, isCompleted: false },
];
