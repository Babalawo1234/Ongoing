// Normalized Database Schema and Access Layer
// Matches the ER Diagram structure

// Import normalized JSON data
import departments from './data/normalized/departments.json';
import catalogYears from './data/normalized/catalog_years.json';
import programs from './data/normalized/programs.json';
import courses from './data/normalized/courses.json';
import programCourses from './data/normalized/program_courses.json';
import prerequisites from './data/normalized/prerequisites.json';

// ============= TYPE DEFINITIONS =============

export interface Department {
  department_id: number;
  department_name: string;
  school: string;
}

export interface CatalogYear {
  catalog_year_id: number;
  year: string;
  is_active: boolean;
}

export interface Program {
  program_id: number;
  program_name: string;
  degree_type: string;
  total_credits_required: number;
  catalog_year_id: number;
  department_id: number;
}

export interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  credits: number;
  department_id: number;
}

export interface ProgramCourse {
  program_id: number;
  course_id: number;
  core: boolean;
  is_gened: boolean;
  is_major: boolean;
  elective: boolean;
  year_required: number;
  semester: number;
  concentration: string | null;
}

export interface Prerequisite {
  course_id: number;
  prerequisite_course_id: number;
  is_mandatory: boolean;
}

export interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  enrollment_date: string;
}

export interface StudentProgram {
  student_id: string;
  program_id: number;
  declaration_date: string;
}

export interface StudentCourse {
  student_course_id: string;
  student_id: string;
  course_id: number;
  semester_taken: string;
  grade: string;
  credits_earned: number;
}

// ============= DATABASE CLASS =============

export class NormalizedDatabase {
  private static instance: NormalizedDatabase;

  private constructor() {}

  public static getInstance(): NormalizedDatabase {
    if (!NormalizedDatabase.instance) {
      NormalizedDatabase.instance = new NormalizedDatabase();
    }
    return NormalizedDatabase.instance;
  }

  // ============= DEPARTMENT QUERIES =============

  getDepartments(): Department[] {
    return departments as Department[];
  }

  getDepartmentById(id: number): Department | undefined {
    return this.getDepartments().find(d => d.department_id === id);
  }

  getDepartmentsBySchool(school: string): Department[] {
    return this.getDepartments().filter(d => d.school === school);
  }

  // ============= CATALOG YEAR QUERIES =============

  getCatalogYears(): CatalogYear[] {
    return catalogYears as CatalogYear[];
  }

  getActiveCatalogYears(): CatalogYear[] {
    return this.getCatalogYears().filter(cy => cy.is_active);
  }

  getCatalogYearById(id: number): CatalogYear | undefined {
    return this.getCatalogYears().find(cy => cy.catalog_year_id === id);
  }

  // ============= PROGRAM QUERIES =============

  getPrograms(): Program[] {
    return programs as Program[];
  }

  getProgramById(id: number): Program | undefined {
    return this.getPrograms().find(p => p.program_id === id);
  }

  getProgramByName(name: string): Program | undefined {
    return this.getPrograms().find(p => p.program_name === name);
  }

  getProgramsByDepartment(departmentId: number): Program[] {
    return this.getPrograms().filter(p => p.department_id === departmentId);
  }

  getProgramsByCatalogYear(catalogYearId: number): Program[] {
    return this.getPrograms().filter(p => p.catalog_year_id === catalogYearId);
  }

  // ============= COURSE QUERIES =============

  getCourses(): Course[] {
    return courses as Course[];
  }

  getCourseById(id: number): Course | undefined {
    return this.getCourses().find(c => c.course_id === id);
  }

  getCourseByCode(code: string): Course | undefined {
    return this.getCourses().find(c => c.course_code === code);
  }

  getCoursesByDepartment(departmentId: number): Course[] {
    return this.getCourses().filter(c => c.department_id === departmentId);
  }

  // ============= PROGRAM-COURSE QUERIES =============

  getProgramCourses(): ProgramCourse[] {
    return programCourses as ProgramCourse[];
  }

  getCoursesForProgram(programId: number): ProgramCourse[] {
    return this.getProgramCourses().filter(pc => pc.program_id === programId);
  }

  getProgramsForCourse(courseId: number): ProgramCourse[] {
    return this.getProgramCourses().filter(pc => pc.course_id === courseId);
  }

  getCoursesByProgramAndSemester(programId: number, semester: number): ProgramCourse[] {
    return this.getProgramCourses().filter(
      pc => pc.program_id === programId && pc.semester === semester
    );
  }

  getElectivesForProgram(programId: number): ProgramCourse[] {
    return this.getCoursesForProgram(programId).filter(pc => pc.elective);
  }

  getCoreCoursesForProgram(programId: number): ProgramCourse[] {
    return this.getCoursesForProgram(programId).filter(pc => pc.core);
  }

  // ============= ENRICHED QUERIES (WITH JOINS) =============

  /**
   * Get full course details for a program (joins Course and ProgramCourse)
   */
  getEnrichedCoursesForProgram(programId: number) {
    const programCoursesList = this.getCoursesForProgram(programId);
    
    return programCoursesList.map(pc => {
      const course = this.getCourseById(pc.course_id);
      return {
        ...course,
        ...pc,
      };
    }).filter(c => c.course_id !== undefined);
  }

  /**
   * Get program with department info
   */
  getProgramWithDepartment(programId: number) {
    const program = this.getProgramById(programId);
    if (!program) return null;

    const department = this.getDepartmentById(program.department_id);
    const catalogYear = this.getCatalogYearById(program.catalog_year_id);

    return {
      ...program,
      department,
      catalogYear,
    };
  }

  /**
   * Get course with prerequisites
   */
  getCourseWithPrerequisites(courseId: number) {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    const prereqs = this.getPrerequisites().filter(p => p.course_id === courseId);
    const prerequisiteCourses = prereqs.map(p => this.getCourseById(p.prerequisite_course_id));

    return {
      ...course,
      prerequisites: prerequisiteCourses.filter(c => c !== undefined),
    };
  }

  // ============= PREREQUISITE QUERIES =============

  getPrerequisites(): Prerequisite[] {
    return prerequisites as Prerequisite[];
  }

  getPrerequisitesForCourse(courseId: number): Prerequisite[] {
    return this.getPrerequisites().filter(p => p.course_id === courseId);
  }

  getCoursesRequiringPrerequisite(prerequisiteId: number): Prerequisite[] {
    return this.getPrerequisites().filter(p => p.prerequisite_course_id === prerequisiteId);
  }

  // ============= STUDENT DATA (LOCALSTORAGE) =============

  /**
   * Get student courses from localStorage
   */
  getStudentCourses(studentId: string): StudentCourse[] {
    if (typeof window === 'undefined') return [];
    
    const key = `student_courses_${studentId}`;
    const data = localStorage.getItem(key);
    
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse student courses:', e);
        return [];
      }
    }
    return [];
  }

  /**
   * Save student course data
   */
  saveStudentCourse(studentId: string, courseData: StudentCourse): void {
    if (typeof window === 'undefined') return;
    
    const courses = this.getStudentCourses(studentId);
    const existingIndex = courses.findIndex(
      c => c.course_id === courseData.course_id
    );

    if (existingIndex >= 0) {
      courses[existingIndex] = courseData;
    } else {
      courses.push(courseData);
    }

    const key = `student_courses_${studentId}`;
    localStorage.setItem(key, JSON.stringify(courses));
    window.dispatchEvent(new Event('storage'));
  }

  /**
   * Initialize student courses based on their program
   */
  initializeStudentCourses(studentId: string, programName: string): void {
    if (typeof window === 'undefined') return;

    const key = `student_courses_${studentId}`;
    
    // Check if already initialized
    if (localStorage.getItem(key)) {
      return;
    }

    const program = this.getProgramByName(programName);
    if (!program) {
      console.warn(`Program not found: ${programName}`);
      return;
    }

    const programCoursesList = this.getEnrichedCoursesForProgram(program.program_id);
    
    const studentCourses: StudentCourse[] = programCoursesList.map((pc, index) => ({
      student_course_id: `${studentId}_${pc.course_id}_${Date.now()}_${index}`,
      student_id: studentId,
      course_id: pc.course_id!,
      semester_taken: '',
      grade: '',
      credits_earned: 0,
    }));

    localStorage.setItem(key, JSON.stringify(studentCourses));
    console.log(`Initialized ${studentCourses.length} courses for student ${studentId}`);
  }

  /**
   * Get student program enrollment
   */
  getStudentProgram(studentId: string): StudentProgram | null {
    if (typeof window === 'undefined') return null;
    
    const key = `student_program_${studentId}`;
    const data = localStorage.getItem(key);
    
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse student program:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Save student program enrollment
   */
  saveStudentProgram(studentId: string, programId: number): void {
    if (typeof window === 'undefined') return;
    
    const studentProgram: StudentProgram = {
      student_id: studentId,
      program_id: programId,
      declaration_date: new Date().toISOString(),
    };

    const key = `student_program_${studentId}`;
    localStorage.setItem(key, JSON.stringify(studentProgram));
  }
}

// Export singleton instance
export const db = NormalizedDatabase.getInstance();
