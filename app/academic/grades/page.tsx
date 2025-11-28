'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  yearOfStudy: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
}

interface Grade {
  studentId: string;
  courseId: string;
  grade: string;
  semester: string;
  year: string;
}

export default function AcademicGradesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGrade, setEditingGrade] = useState<{courseId: string; currentGrade: string} | null>(null);
  const [newGrade, setNewGrade] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // Load courses when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      const userCoursesKey = `user_courses_${selectedStudent}`;
      const studentCourses = localStorage.getItem(userCoursesKey);
      if (studentCourses) {
        setCourses(JSON.parse(studentCourses));
      } else {
        setCourses([]);
      }
    } else {
      setCourses([]);
    }
  }, [selectedStudent]);

  const loadData = () => {
    // Load students
    const storedUsers = localStorage.getItem('aun_checksheet_users');
    if (storedUsers) {
      const allUsers = JSON.parse(storedUsers);
      const studentUsers = allUsers.filter((u: any) => u.role === 'student');
      setStudents(studentUsers);
    }

    // Load grades
    const storedGrades = localStorage.getItem('student_grades');
    if (storedGrades) {
      setGrades(JSON.parse(storedGrades));
    }
  };

  const saveGrades = (gradesToSave: Grade[]) => {
    localStorage.setItem('student_grades', JSON.stringify(gradesToSave));
    setGrades(gradesToSave);
  };

  const handleGradeUpdate = (courseId: string) => {
    if (!selectedStudent || !newGrade) return;

    const existingGradeIndex = grades.findIndex(
      (g) => g.studentId === selectedStudent && g.courseId === courseId
    );

    const currentYear = new Date().getFullYear().toString();
    const currentSemester = 'Fall'; // You can make this dynamic

    if (existingGradeIndex >= 0) {
      // Update existing grade
      const updatedGrades = [...grades];
      updatedGrades[existingGradeIndex] = {
        ...updatedGrades[existingGradeIndex],
        grade: newGrade,
      };
      saveGrades(updatedGrades);
    } else {
      // Add new grade
      const newGradeEntry: Grade = {
        studentId: selectedStudent,
        courseId,
        grade: newGrade,
        semester: currentSemester,
        year: currentYear,
      };
      saveGrades([...grades, newGradeEntry]);
    }

    setEditingGrade(null);
    setNewGrade('');
  };

  const getStudentGrade = (studentId: string, courseId: string) => {
    const grade = grades.find(
      (g) => g.studentId === studentId && g.courseId === courseId
    );
    return grade?.grade || '-';
  };

  const calculateGPA = (studentId: string) => {
    const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    const studentGrades = grades.filter((g) => g.studentId === studentId);
    
    if (studentGrades.length === 0) return '0.00';

    let totalPoints = 0;
    let totalCredits = 0;

    studentGrades.forEach((g) => {
      const course = courses.find((c) => c.id === g.courseId);
      if (course && gradePoints[g.grade] !== undefined) {
        totalPoints += gradePoints[g.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grade Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage student grades</p>
      </div>

      {/* Student Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No students found</p>
              ) : (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedStudent === student.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{student.studentId}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{student.yearOfStudy}L</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Grade Entry */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedStudentData?.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Student ID: {selectedStudentData?.studentId} | GPA: {calculateGPA(selectedStudent)}
                  </p>
                </div>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No courses available. Add courses first.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Course Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Course Title
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {courses.map((course) => {
                        const currentGrade = getStudentGrade(selectedStudent, course.id);
                        const isEditing = editingGrade?.courseId === course.id;

                        return (
                          <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                              {course.code}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {course.title}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-center">
                              {course.credits}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isEditing ? (
                                <select
                                  value={newGrade}
                                  onChange={(e) => setNewGrade(e.target.value)}
                                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  autoFocus
                                >
                                  <option value="">Select Grade</option>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="E">E</option>
                                  <option value="F">F</option>
                                </select>
                              ) : (
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    currentGrade === 'A'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : currentGrade === 'B'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      : currentGrade === 'C'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : currentGrade === 'D' || currentGrade === 'E'
                                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                      : currentGrade === 'F'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                  }`}
                                >
                                  {currentGrade}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleGradeUpdate(course.id)}
                                    disabled={!newGrade}
                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <CheckCircleIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingGrade(null);
                                      setNewGrade('');
                                    }}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <XCircleIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingGrade({ courseId: course.id, currentGrade });
                                    setNewGrade(currentGrade !== '-' ? currentGrade : '');
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">Select a student to view and manage grades</p>
            </div>
          )}
        </div>
      </div>

      {/* Grade Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Scale</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-2 rounded-lg font-semibold mb-1">A</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">5.0 Points</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-2 rounded-lg font-semibold mb-1">B</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">4.0 Points</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-2 rounded-lg font-semibold mb-1">C</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">3.0 Points</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-2 rounded-lg font-semibold mb-1">D</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">2.0 Points</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-2 rounded-lg font-semibold mb-1">E</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">1.0 Point</p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-2 rounded-lg font-semibold mb-1">F</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">0.0 Points</p>
          </div>
        </div>
      </div>
    </div>
  );
}
