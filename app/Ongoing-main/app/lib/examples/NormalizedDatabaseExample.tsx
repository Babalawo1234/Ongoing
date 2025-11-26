'use client';

/**
 * Example Component: Using Normalized Database
 * 
 * This demonstrates how to use the normalized database in React components
 */

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/normalizedDatabase';
import type { Department, Program, Course } from '@/app/lib/normalizedDatabase';

export default function NormalizedDatabaseExample() {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [courses, setCourses] = useState<any[]>([]);

  // Get all unique schools
  const schools = Array.from(new Set(db.getDepartments().map(d => d.school)));

  // Load departments when school is selected
  useEffect(() => {
    if (selectedSchool) {
      const depts = db.getDepartmentsBySchool(selectedSchool);
      setDepartments(depts);
      setSelectedDepartment(null);
      setPrograms([]);
      setSelectedProgram(null);
      setCourses([]);
    }
  }, [selectedSchool]);

  // Load programs when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      const progs = db.getProgramsByDepartment(selectedDepartment);
      setPrograms(progs);
      setSelectedProgram(null);
      setCourses([]);
    }
  }, [selectedDepartment]);

  // Load courses when program is selected
  useEffect(() => {
    if (selectedProgram) {
      const enrichedCourses = db.getEnrichedCoursesForProgram(selectedProgram);
      setCourses(enrichedCourses);
    }
  }, [selectedProgram]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Normalized Database Example</h1>
      
      {/* School Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select School</label>
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select a School --</option>
          {schools.map(school => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
      </div>

      {/* Department Selection */}
      {departments.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Select Department</label>
          <select
            value={selectedDepartment || ''}
            onChange={(e) => setSelectedDepartment(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select a Department --</option>
            {departments.map(dept => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Program Selection */}
      {programs.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Select Program</label>
          <select
            value={selectedProgram || ''}
            onChange={(e) => setSelectedProgram(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select a Program --</option>
            {programs.map(prog => (
              <option key={prog.program_id} value={prog.program_id}>
                {prog.program_name} ({prog.degree_type})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Courses Display */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Courses ({courses.length} total)
          </h2>
          
          {/* Group by year */}
          {[1, 2, 3, 4].map(year => {
            const yearCourses = courses.filter(c => c.year_required === year);
            if (yearCourses.length === 0) return null;

            return (
              <div key={year} className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Year {year}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yearCourses.map(course => (
                    <div
                      key={course.course_id}
                      className="p-4 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{course.course_code}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          course.elective
                            ? 'bg-yellow-100 text-yellow-800'
                            : course.core
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.elective ? 'Elective' : course.core ? 'Core' : 'Major'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{course.course_name}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Credits: {course.credits}</span>
                        <span>Semester: {course.semester}</span>
                      </div>
                      
                      {/* Show prerequisites if any */}
                      {(() => {
                        const prereqs = db.getPrerequisitesForCourse(course.course_id);
                        if (prereqs.length === 0) return null;
                        
                        return (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs font-medium text-gray-700">Prerequisites:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prereqs.map(prereq => {
                                const prereqCourse = db.getCourseById(prereq.prerequisite_course_id);
                                return (
                                  <span
                                    key={prereq.prerequisite_course_id}
                                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                                  >
                                    {prereqCourse?.course_code}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* API Usage Examples */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">API Usage Examples</h2>
        <pre className="bg-white p-4 rounded border text-xs overflow-x-auto">
{`// Import the database
import { db } from '@/app/lib/normalizedDatabase';

// Get all departments
const departments = db.getDepartments();

// Get departments by school
const engineeringDepts = db.getDepartmentsBySchool('Engineering');

// Get a specific program
const program = db.getProgramByName('Computer Science');

// Get all courses for a program
const courses = db.getEnrichedCoursesForProgram(1);

// Get course with prerequisites
const courseWithPrereqs = db.getCourseWithPrerequisites(11);

// Get electives for a program
const electives = db.getElectivesForProgram(1);

// Initialize student courses
db.initializeStudentCourses('student-123', 'Petroleum Engineering');

// Get student courses
const studentCourses = db.getStudentCourses('student-123');

// Save student progress
db.saveStudentCourse('student-123', {
  student_course_id: 'unique-id',
  student_id: 'student-123',
  course_id: 5,
  semester_taken: '2022-Fall',
  grade: 'A',
  credits_earned: 4,
});`}
        </pre>
      </div>
    </div>
  );
}
