'use client';

import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  IdentificationIcon,
  BookOpenIcon,
  FunnelIcon,
  XMarkIcon,
  ChartBarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  yearOfStudy?: string;
  catalogYear?: string;
  school?: string;
  course?: string;
  degreeType?: string;
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

export default function AcademicStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load students
    const savedUsers = localStorage.getItem('aun_checksheet_users');
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      const studentUsers = allUsers.filter((u: any) => u.role === 'student');
      setStudents(studentUsers);
    }

    // Load grades
    const storedGrades = localStorage.getItem('student_grades');
    if (storedGrades) {
      setGrades(JSON.parse(storedGrades));
    }
  };

  const calculateGPA = (studentId: string) => {
    const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    const studentGrades = grades.filter((g) => g.studentId === studentId);
    
    if (studentGrades.length === 0) return 0;

    // Load student's courses from their user-specific storage
    const userCoursesKey = `user_courses_${studentId}`;
    const studentCoursesData = localStorage.getItem(userCoursesKey);
    const studentCourses = studentCoursesData ? JSON.parse(studentCoursesData) : [];

    let totalPoints = 0;
    let totalCredits = 0;

    studentGrades.forEach((g) => {
      const course = studentCourses.find((c: any) => c.id === g.courseId);
      if (course && gradePoints[g.grade] !== undefined) {
        totalPoints += gradePoints[g.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const getStudentGrades = (studentId: string) => {
    return grades.filter((g) => g.studentId === studentId);
  };

  const getStudentCourses = (studentId: string) => {
    const studentGrades = getStudentGrades(studentId);
    // Load student's courses from their user-specific storage
    const userCoursesKey = `user_courses_${studentId}`;
    const studentCoursesData = localStorage.getItem(userCoursesKey);
    const studentCourses = studentCoursesData ? JSON.parse(studentCoursesData) : [];
    
    return studentGrades.map((g) => {
      const course = studentCourses.find((c: any) => c.id === g.courseId);
      return course ? { ...course, grade: g.grade, semester: g.semester, year: g.year } : null;
    }).filter((c) => c !== null);
  };

  const openStudentModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.course && student.course.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === 'all' || student.yearOfStudy === selectedLevel;
    const matchesSchool = selectedSchool === 'all' || student.school === selectedSchool;
    
    return matchesSearch && matchesLevel && matchesSchool;
  });

  const levels = ['100', '200', '300', '400', '500'];
  const schools = ['Engineering', 'Arts & Sciences', 'Business & Entrepreneurship', 'IT & Computing'];

  const stats = {
    total: students.length,
    byLevel: {
      '100': students.filter(s => s.yearOfStudy === '100').length,
      '200': students.filter(s => s.yearOfStudy === '200').length,
      '300': students.filter(s => s.yearOfStudy === '300').length,
      '400': students.filter(s => s.yearOfStudy === '400').length,
      '500': students.filter(s => s.yearOfStudy === '500').length,
    },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Tracking</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor all registered students and their academic information
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
        </div>
        {Object.entries(stats.byLevel).map(([level, count]) => (
          <div key={level} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{level} Level</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level} Level</option>
            ))}
          </select>

          {/* School Filter */}
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Schools</option>
            {schools.map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{student.name}</h3>
                  {student.yearOfStudy && (
                    <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded text-xs font-medium">
                      {student.yearOfStudy} Level
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white truncate">{student.email}</p>
                </div>
              </div>
              
              {student.studentId && (
                <div className="flex items-start gap-2">
                  <IdentificationIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Student ID</p>
                    <p className="text-sm text-gray-900 dark:text-white">{student.studentId}</p>
                  </div>
                </div>
              )}
              
              {student.course && (
                <div className="flex items-start gap-2">
                  <BookOpenIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Course/Major</p>
                    <p className="text-sm text-gray-900 dark:text-white">{student.course}</p>
                  </div>
                </div>
              )}
              
              {student.school && (
                <div className="flex items-start gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">School</p>
                    <p className="text-sm text-gray-900 dark:text-white">School of {student.school}</p>
                  </div>
                </div>
              )}
              
              {student.catalogYear && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Catalog Year</p>
                  <p className="text-sm text-gray-900 dark:text-white">{student.catalogYear}</p>
                </div>
              )}
            </div>
            <div className="px-6 pb-4 space-y-2">
              <button
                onClick={() => window.location.href = `/academic/students/${student.id}/progress`}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
              >
                View Progress
              </button>
              <button
                onClick={() => openStudentModal(student)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                View Full Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
          <UserGroupIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No students found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Student Details Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStudent.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStudent.studentId}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Student Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{selectedStudent.email}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Year of Study</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{selectedStudent.yearOfStudy} Level</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Course/Major</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{selectedStudent.course || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">School</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{selectedStudent.school || 'N/A'}</p>
                  </div>
                </div>

                {/* Academic Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <TrophyIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">GPA</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateGPA(selectedStudent.id).toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Out of 5.0</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <BookOpenIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{getStudentGrades(selectedStudent.id).length}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Credits</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {getStudentCourses(selectedStudent.id).reduce((sum, c: any) => sum + c.credits, 0)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total earned</p>
                  </div>
                </div>

                {/* Courses and Grades */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course History</h3>
                  {getStudentCourses(selectedStudent.id).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No courses recorded yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Course Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Credits
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Grade
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Semester
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {getStudentCourses(selectedStudent.id).map((course: any, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {course.code}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                {course.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">
                                {course.credits}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    course.grade === 'A'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : course.grade === 'B'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      : course.grade === 'C'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : course.grade === 'D' || course.grade === 'E'
                                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  }`}
                                >
                                  {course.grade}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">
                                {course.semester} {course.year}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
