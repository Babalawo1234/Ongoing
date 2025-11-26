# Database Structure Overview

## Normalized Database Architecture

```
┌─────────────────┐
│   department    │
├─────────────────┤
│ department_id   │◄─────────┐
│ department_name │          │
│ school          │          │
└─────────────────┘          │
                             │
                             │
┌─────────────────┐          │         ┌──────────────────┐
│  catalog_year   │          │         │      course      │
├─────────────────┤          │         ├──────────────────┤
│ catalog_year_id │◄───┐     │         │ course_id        │
│ year            │    │     └─────────┤ course_code      │
│ is_active       │    │               │ course_name      │
└─────────────────┘    │               │ credits          │
                       │               │ department_id    │
                       │               └──────────────────┘
                       │                        ▲
┌─────────────────────────┐                    │
│       program           │                    │
├─────────────────────────┤                    │
│ program_id              │                    │
│ program_name            │                    │
│ degree_type             │                    │
│ total_credits_required  │                    │
│ catalog_year_id         ├────────────────────┘
│ department_id           │                    │
└─────────────────────────┘                    │
         │                                     │
         │                                     │
         │    ┌──────────────────────┐         │
         │    │  program_course      │         │
         │    ├──────────────────────┤         │
         └────┤ program_id           │         │
              │ course_id            ├─────────┘
              │ core                 │
              │ is_gened             │
              │ is_major             │
              │ elective             │
              │ year_required        │
              │ semester             │
              │ concentration        │
              └──────────────────────┘


┌──────────────────┐         ┌──────────────────────┐
│  prerequisite    │         │   student_course     │
├──────────────────┤         ├──────────────────────┤
│ course_id        │         │ student_course_id    │
│ prerequisite_id  │         │ student_id           │
│ is_mandatory     │         │ course_id            │
└──────────────────┘         │ semester_taken       │
                             │ grade                │
                             │ credits_earned       │
                             └──────────────────────┘
```

## Entity Relationships

### One-to-Many Relationships
- **Department** → **Courses** (one department has many courses)
- **Department** → **Programs** (one department has many programs)
- **Catalog Year** → **Programs** (one catalog year has many programs)
- **Student** → **Student Courses** (one student has many course enrollments)

### Many-to-Many Relationships
- **Program** ↔ **Course** (via `program_course` junction table)
  - A program has many courses
  - A course can be in many programs
  - Junction table stores additional data (core, elective, semester, etc.)

### Self-Referencing Relationship
- **Course** → **Course** (via `prerequisite` table)
  - A course can have multiple prerequisites
  - A course can be a prerequisite for multiple courses

## Key Features

### 1. Referential Integrity
- All foreign keys properly defined
- Consistent data types across relationships
- department_id: INT everywhere (fixed from ER diagram issue)

### 2. Data Normalization Benefits

#### Before (Denormalized)
- Course data duplicated across programs
- No prerequisite tracking
- Hard to update course information
- ~5000+ lines of redundant JSON

#### After (Normalized)
- Courses defined once
- Linked to programs via junction table
- Easy to update and maintain
- ~1000 lines of structured JSON

### 3. Flexible Course Requirements

The `program_course` junction table supports:
- **Core courses** - Required for all students
- **Major courses** - Specific to the major
- **General Education** - University-wide requirements
- **Electives** - Optional courses
- **Concentration** - Specialization tracks
- **Semester planning** - When course should be taken

### 4. Prerequisite Management

Prerequisites tracked with:
- Course relationships
- Mandatory vs. recommended
- Multi-level dependencies

## Data Flow

```
User Signup
    ↓
[Select Program] → Query programs.json
    ↓
[Initialize Courses] → Query program_courses.json
    ↓                → Query courses.json
[Student Courses]  → Save to localStorage
    ↓
[Update Progress] → Update student_courses
    ↓
[Calculate Stats] → Join with course data
    ↓
[Display Dashboard]
```

## Storage Strategy

### Static Data (JSON Files)
- departments.json
- catalog_years.json
- programs.json
- courses.json
- program_courses.json
- prerequisites.json

**Location**: `app/lib/data/normalized/`

### Dynamic Data (LocalStorage)
- student_courses_{userId}
- student_program_{userId}
- user_courses_{userId} (legacy)

**Location**: Browser localStorage

### Why This Approach?

1. **Static curriculum data** doesn't change frequently → JSON files
2. **Student progress** is user-specific → localStorage
3. **Future-ready** for backend database migration
4. **Performance** - JSON loaded once, localStorage for real-time updates

## Migration Path to Backend

When ready to move to a real database:

```typescript
// Current (JSON + LocalStorage)
const courses = db.getCourses();

// Future (PostgreSQL/MySQL)
const courses = await db.getCourses();

// API layer stays the same!
```

The normalized structure matches standard SQL database design, making migration straightforward:

```sql
CREATE TABLE department (
  department_id INT PRIMARY KEY,
  department_name VARCHAR(255),
  school VARCHAR(100)
);

CREATE TABLE course (
  course_id INT PRIMARY KEY,
  course_code VARCHAR(20),
  course_name VARCHAR(255),
  credits INT,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(department_id)
);

-- etc...
```

## Query Examples

### Simple Queries
```typescript
// Get all engineering departments
db.getDepartmentsBySchool('Engineering');

// Get courses for Petroleum Engineering
const program = db.getProgramByName('Petroleum Engineering');
const courses = db.getEnrichedCoursesForProgram(program.program_id);
```

### Complex Queries
```typescript
// Get all electives with prerequisites
const electives = db.getElectivesForProgram(programId);
const electivesWithPrereqs = electives.map(e => 
  db.getCourseWithPrerequisites(e.course_id)
);

// Get program with full details
const programDetails = db.getProgramWithDepartment(programId);
// Returns: { program, department, catalogYear }
```

## Advantages Summary

✅ **Single Source of Truth** - Each entity defined once  
✅ **Data Integrity** - Consistent relationships  
✅ **Maintainability** - Easy to update  
✅ **Scalability** - Add new entities easily  
✅ **Flexibility** - Support multiple catalog years  
✅ **Query Power** - Rich relational queries  
✅ **Type Safety** - Full TypeScript support  
✅ **Backward Compatible** - Old API still works  
✅ **Future-Ready** - Easy backend migration  
✅ **Performance** - Efficient data structure  

## Next Steps

1. ✅ Normalized database implemented
2. ✅ Backward compatibility maintained
3. ⏳ Add remaining courses for all programs
4. ⏳ Implement prerequisite validation
5. ⏳ Add concentration tracking
6. ⏳ Support multiple catalog years
7. ⏳ Build course planning algorithm
8. ⏳ Migrate to backend database
