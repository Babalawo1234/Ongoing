'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
  BookOpenIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { db } from '@/app/lib/normalizedDatabase';
import type { Course, Department } from '@/app/lib/normalizedDatabase';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  school?: string;
  department?: string;
  catalogYear?: string;
  yearOfStudy?: string;
}

interface StudentCourse extends Course {
  level?: string;
  completed?: boolean;
  grade?: string;
}

export default function AssignCoursesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [catalogYears, setCatalogYears] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<number | 'all'>('all');
  const [filterCatalog, setFilterCatalog] = useState<number | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  useEffect(() => {
    loadStudents();
    setDepartments(db.getDepartments());
    setCatalogYears(db.getCatalogYears());
    setAvailableCourses(db.getCourses());
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentCourses(selectedStudent.id);
    }
  }, [selectedStudent]);

  const loadStudents = () => {
    const storedUsers = localStorage.getItem('aun_checksheet_users');
    if (storedUsers) {
      const allUsers = JSON.parse(storedUsers);
      const studentUsers = allUsers.filter((u: any) => u.role === 'student');
      setStudents(studentUsers);
    }
  };

  const loadStudentCourses = (studentId: string) => {
    const userCoursesKey = `user_courses_${studentId}`;
    const savedCourses = localStorage.getItem(userCoursesKey);
    if (savedCourses) {
      setStudentCourses(JSON.parse(savedCourses));
    } else {
      setStudentCourses([]);
    }
  };

  const saveStudentCourses = (studentId: string, courses: StudentCourse[]) => {
    const userCoursesKey = `user_courses_${studentId}`;
    localStorage.setItem(userCoursesKey, JSON.stringify(courses));
    setStudentCourses(courses);
  };

  const addCourseToStudent = (course: Course) => {
    if (!selectedStudent) return;

    // Check if course already assigned
    const exists = studentCourses.some(c => c.course_id === course.course_id);
    if (exists) {
      alert('This course is already assigned to this student!');
      return;
    }

    // Determine level based on course code (e.g., CSC 101 -> 100L)
    const courseNumber = parseInt(course.course_code.match(/\d+/)?.[0] || '0');
    const level = courseNumber >= 600 ? '600L' :
                  courseNumber >= 500 ? '500L' :
                  courseNumber >= 400 ? '400L' :
                  courseNumber >= 300 ? '300L' :
                  courseNumber >= 200 ? '200L' : '100L';

    const newCourse: any = {
      ...course,
      id: `${selectedStudent.id}-${course.course_id}-${Date.now()}`,
      code: course.course_code,
      title: course.course_name,
      level,
      completed: false,
      grade: '',
    };

    const updatedCourses = [...studentCourses, newCourse];
    saveStudentCourses(selectedStudent.id, updatedCourses);
  };

  const removeCourseFromStudent = (courseId: number, courseName: string) => {
    if (!selectedStudent) return;

    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove "${courseName}" from ${selectedStudent.name}'s courses?\n\nThis will only remove it from this student's assigned courses and will not affect other students or the master course list.`
    );

    if (!confirmed) return;

    // Remove course from this student only
    const updatedCourses = studentCourses.filter(c => c.course_id !== courseId);
    saveStudentCourses(selectedStudent.id, updatedCourses);

    // Show success message
    alert(`Successfully removed "${courseName}" from ${selectedStudent.name}'s courses.`);
  };

  const getDepartmentName = (departmentId: number) => {
    const dept = departments.find(d => d.department_id === departmentId);
    return dept?.department_name || 'Unknown';
  };

  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || course.department_id === filterDepartment;
    
    // Filter by level based on course code
    if (filterLevel !== 'all') {
      const courseNumber = parseInt(course.course_code.match(/\d+/)?.[0] || '0');
      const courseLevel = courseNumber >= 600 ? '600L' :
                         courseNumber >= 500 ? '500L' :
                         courseNumber >= 400 ? '400L' :
                         courseNumber >= 300 ? '300L' :
                         courseNumber >= 200 ? '200L' : '100L';
      if (courseLevel !== filterLevel) return false;
    }

    return matchesSearch && matchesDepartment;
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assign Courses to Students</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage course assignments for individual students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Student</h2>
            
            <div className="mb-4 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedStudent?.id === student.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{student.studentId}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {student.yearOfStudy ? `${student.yearOfStudy}L` : 'N/A'} • {student.school || 'N/A'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Assignment Panel */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <UserCircleIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedStudent.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedStudent.studentId} • {selectedStudent.school} • {selectedStudent.yearOfStudy}L
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{studentCourses.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Courses Assigned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Courses */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned Courses</h3>
                    {studentCourses.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Click <TrashIcon className="inline h-3 w-3" /> to remove
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {studentCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No courses assigned yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {studentCourses.map((course) => (
                        <div
                          key={course.course_id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">{(course as any).code || course.course_code}</span>
                              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded-full">
                                {(course as any).level}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{(course as any).title || course.course_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {course.credits} credits • {getDepartmentName(course.department_id)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeCourseFromStudent(course.course_id, (course as any).title || course.course_name)}
                            className="ml-4 p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove course from this student"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Available Courses */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Courses</h3>
                  
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department
                      </label>
                      <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept.department_id} value={dept.department_id}>
                            {dept.department_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Level
                      </label>
                      <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Levels</option>
                        <option value="100L">100 Level</option>
                        <option value="200L">200 Level</option>
                        <option value="300L">300 Level</option>
                        <option value="400L">400 Level</option>
                        <option value="500L">500 Level</option>
                        <option value="600L">600 Level</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Search
                      </label>
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search courses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 max-h-[400px] overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No courses found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredCourses.map((course) => {
                        const isAssigned = studentCourses.some(c => c.course_id === course.course_id);
                        return (
                          <div
                            key={course.course_id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              isAssigned
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">{course.course_code}</span>
                                {isAssigned && (
                                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.course_name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {course.credits} credits • {getDepartmentName(course.department_id)}
                              </p>
                            </div>
                            {!isAssigned && (
                              <button
                                onClick={() => addCourseToStudent(course)}
                                className="ml-4 p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                              >
                                <PlusIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
              <UserCircleIcon className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Select a student to assign courses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
