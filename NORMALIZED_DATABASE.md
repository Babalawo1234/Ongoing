# Normalized Database Structure

## Overview

The application now uses a **normalized database structure** stored in JSON files, matching the Entity Relationship Diagram. This provides better data integrity, maintainability, and scalability compared to the previous denormalized structure.

## Database Schema

The normalized database consists of the following entities:

### Core Tables

1. **departments.json** - Academic departments
   - `department_id` (INT, Primary Key)
   - `department_name` (VARCHAR)
   - `school` (VARCHAR)

2. **catalog_years.json** - Academic catalog years
   - `catalog_year_id` (INT, Primary Key)
   - `year` (VARCHAR)
   - `is_active` (BOOLEAN)

3. **programs.json** - Academic programs/majors
   - `program_id` (INT, Primary Key)
   - `program_name` (VARCHAR)
   - `degree_type` (VARCHAR)
   - `total_credits_required` (INT)
   - `catalog_year_id` (INT, Foreign Key → catalog_years)
   - `department_id` (INT, Foreign Key → departments)

4. **courses.json** - Course definitions
   - `course_id` (INT, Primary Key)
   - `course_code` (VARCHAR)
   - `course_name` (VARCHAR)
   - `credits` (INT)
   - `department_id` (INT, Foreign Key → departments)

### Junction/Relationship Tables

5. **program_courses.json** - Links programs to courses with requirements
   - `program_id` (INT, Foreign Key → programs)
   - `course_id` (INT, Foreign Key → courses)
   - `core` (BOOLEAN) - Is this a core course?
   - `is_gened` (BOOLEAN) - Is this a general education course?
   - `is_major` (BOOLEAN) - Is this a major course?
   - `elective` (BOOLEAN) - Is this an elective?
   - `year_required` (INT) - Year when course should be taken
   - `semester` (INT) - Semester number (1-8)
   - `concentration` (VARCHAR, nullable) - Specific concentration

6. **prerequisites.json** - Course prerequisites
   - `course_id` (INT, Foreign Key → courses)
   - `prerequisite_course_id` (INT, Foreign Key → courses)
   - `is_mandatory` (BOOLEAN)

### Student Data (LocalStorage)

Student-specific data is stored in localStorage with these structures:

- **student_courses_{userId}** - Student's course enrollments
- **student_program_{userId}** - Student's program enrollment
- **user_courses_{userId}** - Legacy format (for backward compatibility)

## Usage Examples

### Basic Queries

```typescript
import { db } from '@/app/lib/normalizedDatabase';

// Get all departments
const departments = db.getDepartments();

// Get a specific program
const program = db.getProgramByName('Petroleum Engineering');

// Get all courses for a program
const courses = db.getEnrichedCoursesForProgram(1);

// Get prerequisites for a course
const courseWithPrereqs = db.getCourseWithPrerequisites(11);
```

### Complex Queries

```typescript
// Get all electives for a program
const electives = db.getElectivesForProgram(1);

// Get courses by semester
const semesterCourses = db.getCoursesByProgramAndSemester(1, 3);

// Get program with department info
const programDetails = db.getProgramWithDepartment(1);

// Get departments by school
const engineeringDepts = db.getDepartmentsBySchool('Engineering');
```

### Student Data Management

```typescript
// Initialize courses for a student
db.initializeStudentCourses('student-123', 'Computer Science');

// Get student's courses
const studentCourses = db.getStudentCourses('student-123');

// Save student course progress
db.saveStudentCourse('student-123', {
  student_course_id: 'unique-id',
  student_id: 'student-123',
  course_id: 5,
  semester_taken: '2024-Fall',
  grade: 'A',
  credits_earned: 4,
});

// Save student program enrollment
db.saveStudentProgram('student-123', 6);
```

## Benefits of Normalization

### 1. **Data Integrity**
- Single source of truth for each entity
- Consistent data types across relationships
- Foreign key constraints enforced programmatically

### 2. **Maintainability**
- Easy to update course information in one place
- Changes propagate automatically to all programs
- Clear separation of concerns

### 3. **Flexibility**
- Support multiple catalog years
- Easy to add new programs without duplicating courses
- Flexible prerequisite management

### 4. **Scalability**
- Efficient storage (no data duplication)
- Easy to extend with new entities
- Better performance for complex queries

### 5. **Query Power**
- Rich relational queries with joins
- Filter by school, department, catalog year
- Track prerequisites and course relationships

## Migration from Old Structure

The system maintains **backward compatibility** through the `courseData.ts` wrapper:

```typescript
// Old API still works
import { COURSE_CURRICULA } from '@/app/lib/courseData';
const courses = COURSE_CURRICULA['Petroleum Engineering'];

// But now uses normalized database underneath
import { db } from '@/app/lib/normalizedDatabase';
const enrichedCourses = db.getEnrichedCoursesForProgram(1);
```

## Data Model Comparison

### Before (Denormalized)
```json
{
  "Petroleum Engineering": [
    {
      "id": "pte-101",
      "code": "PTE101",
      "title": "Introduction to Petroleum Engineering",
      "credits": 3,
      "level": "100L",
      "semester": 1
    }
  ]
}
```

### After (Normalized)
```json
// courses.json
{
  "course_id": 1,
  "course_code": "PTE101",
  "course_name": "Introduction to Petroleum Engineering",
  "credits": 3,
  "department_id": 1
}

// program_courses.json
{
  "program_id": 1,
  "course_id": 1,
  "core": true,
  "year_required": 1,
  "semester": 1
}
```

## File Structure

```
app/lib/data/normalized/
├── departments.json         # Academic departments
├── catalog_years.json       # Catalog years
├── programs.json            # Academic programs
├── courses.json             # Course definitions
├── program_courses.json     # Program-course relationships
└── prerequisites.json       # Course prerequisites
```

## Future Enhancements

The normalized structure enables:

1. **Multi-catalog year support** - Different requirements per year
2. **Course sharing** - Same course across multiple programs
3. **Advanced prerequisites** - Complex prerequisite logic
4. **Concentration tracking** - Specializations within programs
5. **Transfer credit mapping** - Easy equivalency management
6. **Academic planning** - Better course scheduling algorithms

## API Reference

See `app/lib/normalizedDatabase.ts` for complete API documentation.

### Key Methods

- `getDepartments()` - List all departments
- `getPrograms()` - List all programs
- `getCourses()` - List all courses
- `getEnrichedCoursesForProgram(programId)` - Get full course details for a program
- `getCourseWithPrerequisites(courseId)` - Get course with its prerequisites
- `initializeStudentCourses(studentId, programName)` - Setup student courses
- `saveStudentCourse(studentId, courseData)` - Update student progress

## Notes

- All IDs use consistent data types (INT for entities, VARCHAR for codes)
- The singleton pattern ensures one database instance
- LocalStorage used for student data (client-side)
- JSON files for static curriculum data
- TypeScript interfaces ensure type safety
