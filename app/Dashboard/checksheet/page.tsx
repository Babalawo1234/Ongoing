'use client';

import { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '';
type CourseStatus = 'Completed' | 'In Progress' | 'Not Started';

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  status: CourseStatus;
  completed: boolean;
  grade: Grade;
}

const initialCourses: Course[] = [
  // 100 Level
  { id: '1', code: 'CS 101', title: 'Introduction to Computer Science', credits: 3, level: '100L', status: 'Not Started', completed: false, grade: '' },
  { id: '2', code: 'MATH 101', title: 'Calculus I', credits: 3, level: '100L', status: 'Not Started', completed: false, grade: '' },
  { id: '3', code: 'ENG 101', title: 'English Composition', credits: 2, level: '100L', status: 'Not Started', completed: false, grade: '' },
  { id: '4', code: 'PHY 101', title: 'Physics I', credits: 3, level: '100L', status: 'Not Started', completed: false, grade: '' },
  
  // 200 Level
  { id: '5', code: 'CS 201', title: 'Data Structures', credits: 3, level: '200L', status: 'Not Started', completed: false, grade: '' },
  { id: '6', code: 'CS 202', title: 'Computer Architecture', credits: 3, level: '200L', status: 'Not Started', completed: false, grade: '' },
  { id: '7', code: 'MATH 201', title: 'Discrete Mathematics', credits: 3, level: '200L', status: 'Not Started', completed: false, grade: '' },
  { id: '8', code: 'CS 203', title: 'Object-Oriented Programming', credits: 3, level: '200L', status: 'Not Started', completed: false, grade: '' },
  { id: '9', code: 'CS 204', title: 'Database Systems', credits: 3, level: '200L', status: 'Not Started', completed: false, grade: '' },
  
  // 300 Level
  { id: '10', code: 'CS 301', title: 'Algorithms', credits: 4, level: '300L', status: 'Not Started', completed: false, grade: '' },
  { id: '11', code: 'CS 302', title: 'Operating Systems', credits: 3, level: '300L', status: 'Not Started', completed: false, grade: '' },
  { id: '12', code: 'CS 303', title: 'Software Engineering', credits: 3, level: '300L', status: 'Not Started', completed: false, grade: '' },
  { id: '13', code: 'CS 304', title: 'Computer Networks', credits: 3, level: '300L', status: 'Not Started', completed: false, grade: '' },
  { id: '14', code: 'CS 305', title: 'Web Development', credits: 3, level: '300L', status: 'Not Started', completed: false, grade: '' },
  { id: '15', code: 'CS 306', title: 'Artificial Intelligence', credits: 4, level: '300L', status: 'Not Started', completed: false, grade: '' },
  
  // 400 Level
  { id: '16', code: 'CS 401', title: 'Machine Learning', credits: 4, level: '400L', status: 'Not Started', completed: false, grade: '' },
  { id: '17', code: 'CS 402', title: 'Computer Graphics', credits: 3, level: '400L', status: 'Not Started', completed: false, grade: '' },
  { id: '18', code: 'CS 403', title: 'Cybersecurity', credits: 3, level: '400L', status: 'Not Started', completed: false, grade: '' },
  { id: '19', code: 'CS 404', title: 'Final Year Project', credits: 6, level: '400L', status: 'Not Started', completed: false, grade: '' },
];

export default function CheckSheetPage() {
  // Use lazy initialization to load from localStorage immediately
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('academicCourses');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved courses:', e);
        }
      }
    }
    return initialCourses;
  });
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Save to localStorage whenever courses change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('academicCourses', JSON.stringify(courses));
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
    }
  }, [courses]);

  const updateCourseStatus = (courseId: string, newStatus: CourseStatus) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? { 
            ...course, 
            status: newStatus,
            completed: newStatus === 'Completed',
            grade: newStatus !== 'Completed' ? '' : course.grade
          }
        : course
    ));
  };

  const updateGrade = (courseId: string, grade: Grade) => {
    setCourses(courses.map(course =>
      course.id === courseId ? { ...course, grade } : course
    ));
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setCourses(initialCourses);
      localStorage.removeItem('academicCourses');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'academic-checksheet.json';
    link.click();
  };

  const exportToPDF = () => {
    // Hide the action buttons before printing
    const hideElements = document.querySelectorAll('.no-print');
    hideElements.forEach(el => el.classList.add('print:hidden'));

    // Trigger print dialog
    window.print();
  };

  const calculateLevelStats = (level: string) => {
    const levelCourses = courses.filter(c => c.level === level);
    const completed = levelCourses.filter(c => c.completed).length;
    const total = levelCourses.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const calculateGPA = (levelCourses: Course[]) => {
    const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    const completedWithGrades = levelCourses.filter(c => c.completed && c.grade);
    
    if (completedWithGrades.length === 0) return 0;
    
    const totalPoints = completedWithGrades.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] || 0) * course.credits;
    }, 0);
    
    const totalCredits = completedWithGrades.reduce((sum, course) => sum + course.credits, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const levels = ['100L', '200L', '300L', '400L'];
  const filteredCourses = selectedLevel === 'all' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  const groupedCourses = levels.reduce((acc, level) => {
    acc[level] = courses.filter(c => c.level === level);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Check Sheet</h1>
            <p className="mt-2 text-gray-600">Track your course completion and grades</p>
          </div>
          <div className="flex gap-3 no-print">
            <button
              onClick={exportToPDF}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export as PDF
            </button>
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export JSON
            </button>
            <button
              onClick={resetData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto no-print">
        <button
          onClick={() => setSelectedLevel('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedLevel === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Levels
        </button>
        {levels.map(level => {
          const stats = calculateLevelStats(level);
          return (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedLevel === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {level} ({stats.completed}/{stats.total})
            </button>
          );
        })}
      </div>

      {/* Course Levels */}
      {selectedLevel === 'all' ? (
        <div className="space-y-8">
          {levels.map(level => {
            const levelCourses = groupedCourses[level];
            const stats = calculateLevelStats(level);
            const gpa = calculateGPA(levelCourses);

            return (
              <div key={level} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{level} Courses</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Progress: <span className="font-semibold">{stats.percentage.toFixed(0)}%</span>
                      </span>
                      <span className="text-gray-600">
                        GPA: <span className="font-semibold">{gpa.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {levelCourses.map(course => (
                      <CourseItem
                        key={course.id}
                        course={course}
                        onStatusChange={updateCourseStatus}
                        onGradeChange={updateGrade}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3">
            {filteredCourses.map(course => (
              <CourseItem
                key={course.id}
                course={course}
                onStatusChange={updateCourseStatus}
                onGradeChange={updateGrade}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CourseItem({
  course,
  onStatusChange,
  onGradeChange,
}: {
  course: Course;
  onStatusChange: (id: string, status: CourseStatus) => void;
  onGradeChange: (id: string, grade: Grade) => void;
}) {
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700';
      case 'In Progress': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700';
      case 'Not Started': return 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600';
    }
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${getStatusColor(course.status)}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900 dark:text-white">{course.code}</span>
          <span className="text-gray-700 dark:text-gray-300">{course.title}</span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{course.credits} credits</span>
      </div>
      
      {/* Status Display for Print */}
      <div className="hidden print:flex items-center gap-3">
        <span className="px-3 py-1 text-sm font-medium rounded-lg">
          {course.status}
        </span>
        {course.status === 'Completed' && course.grade && (
          <span className="px-3 py-1 text-sm font-medium rounded-lg bg-green-100 text-green-800">
            Grade: {course.grade}
          </span>
        )}
      </div>

      {/* Status Dropdown - Hidden on Print */}
      <select
        value={course.status}
        onChange={(e) => onStatusChange(course.id, e.target.value as CourseStatus)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 print:hidden"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Grade Dropdown - Only show when Completed, Hidden on Print */}
      {course.status === 'Completed' && (
        <select
          value={course.grade}
          onChange={(e) => onGradeChange(course.id, e.target.value as Grade)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 print:hidden"
        >
          <option value="">Select Grade</option>
          <option value="A">A (5.0)</option>
          <option value="B">B (4.0)</option>
          <option value="C">C (3.0)</option>
          <option value="D">D (2.0)</option>
          <option value="E">E (1.0)</option>
          <option value="F">F (0.0)</option>
        </select>
      )}
    </div>
  );
}
