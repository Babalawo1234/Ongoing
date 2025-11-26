'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface DegreeRequirement {
  category: string;
  required: number;
  completed: number;
  percentage: number;
}

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  completed: boolean;
  grade: string;
}

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

export default function AcademicStudentProgressPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [requirements, setRequirements] = useState<DegreeRequirement[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [gpa, setGPA] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('100L');

  useEffect(() => {
    if (!studentId) return;

    // Load student data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundStudent = users.find((u: any) => u.id === studentId);
    if (foundStudent) {
      setStudent(foundStudent);
    }

    // Load student's courses
    const userCoursesKey = `user_courses_${studentId}`;
    const saved = localStorage.getItem(userCoursesKey);
    
    if (saved) {
      const studentCourses = JSON.parse(saved);
      setCourses(studentCourses);
      calculateRequirements(studentCourses);
    }
  }, [studentId]);

  const calculateRequirements = (courses: Course[]) => {
    const levels = ['100L', '200L', '300L', '400L'];
    const reqs: DegreeRequirement[] = levels.map(level => {
      const levelCourses = courses.filter((c: Course) => c.level === level);
      const completed = levelCourses.filter((c: Course) => c.completed).length;
      const total = levelCourses.length;
      return {
        category: `${level} Courses`,
        required: total,
        completed,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      };
    });

    setRequirements(reqs);

    // Calculate overall progress
    const totalCourses = courses.length;
    const completedCourses = courses.filter((c: Course) => c.completed).length;
    setOverallProgress(totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0);

    // Calculate credits
    const total = courses.reduce((sum: number, c: Course) => sum + c.credits, 0);
    const earned = courses.filter((c: Course) => c.completed).reduce((sum: number, c: Course) => sum + c.credits, 0);
    setTotalCredits(total);
    setEarnedCredits(earned);

    // Calculate GPA
    const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    const completedWithGrades = courses.filter((c: Course) => c.completed && c.grade);
    let totalPoints = 0;
    let totalGradeCredits = 0;
    
    completedWithGrades.forEach((course: Course) => {
      if (gradePoints[course.grade] !== undefined) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalGradeCredits += course.credits;
      }
    });
    
    setGPA(totalGradeCredits > 0 ? totalPoints / totalGradeCredits : 0);
  };

  const levels = ['100L', '200L', '300L', '400L'];
  const selectedCourses = courses.filter(c => c.level === selectedLevel);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'C': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'E':
      case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!student) {
    return (
      <div className="page-content flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Back Button */}
      <button
        onClick={() => router.push('/academic/students')}
        className="mb-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Back to Students</span>
      </button>

      {/* Header */}
      <div className="mb-8 animate-slide-in-down">
        <h1 className="text-4xl font-bold gradient-text mb-3">
          Student Academic Progress
        </h1>
        <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{student.name}</span>
          {student.studentId && <span>• {student.studentId}</span>}
        </div>
        {student.course && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {student.course} • {student.yearOfStudy ? `${student.yearOfStudy} Level` : ''} • {student.school}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
        <div className="modern-card p-6 hover-lift stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{overallProgress.toFixed(0)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg float-animation">
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="modern-card p-6 hover-lift stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Credits Earned</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{earnedCredits}/{totalCredits}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg float-animation">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="modern-card p-6 hover-lift stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current GPA</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpa.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg float-animation">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="modern-card p-8 hover-lift mb-8 stagger-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overall Degree Progress</h2>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {overallProgress.toFixed(1)}%
          </span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden shadow-inner">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full shadow-lg animate-gradient animate-progress"
            style={{ width: `${overallProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {earnedCredits} of {totalCredits} credits completed
          </p>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {totalCredits - earnedCredits} credits remaining
          </p>
        </div>
      </div>

      {/* Requirements by Level */}
      <div className="modern-card mb-8 animate-slide-in-left">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Degree Requirements by Level</h2>
        </div>
        <div className="p-6 space-y-6">
          {requirements.map((req, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{req.category}</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {req.completed} / {req.required} courses
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 animate-progress ${
                    req.percentage === 100
                      ? 'bg-green-600'
                      : req.percentage >= 50
                      ? 'bg-blue-600'
                      : 'bg-yellow-600'
                  }`}
                  style={{ width: `${req.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course List by Level */}
      <div className="modern-card animate-fadeIn">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Courses by Level</h2>
          <div className="flex flex-wrap gap-2">
            {levels.map(level => {
              const levelCourses = courses.filter(c => c.level === level);
              const completedCount = levelCourses.filter(c => c.completed).length;
              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLevel === level
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {level} ({completedCount}/{levelCourses.length})
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-6">
          {selectedCourses.length > 0 ? (
            <div className="space-y-3">
              {selectedCourses.map(course => (
                <div
                  key={course.id}
                  className={`border rounded-lg p-4 transition-all ${
                    course.completed
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                      : 'border-gray-300 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {course.completed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                        )}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {course.code}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-7">{course.title}</p>
                      <div className="ml-7 mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          <strong>Credits:</strong> {course.credits}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          course.completed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {course.completed ? 'Completed' : 'In Progress'}
                        </span>
                        {course.completed && course.grade && (
                          <span className={`px-2 py-1 rounded-full font-medium ${getGradeColor(course.grade)}`}>
                            Grade: {course.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No courses for {selectedLevel}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
