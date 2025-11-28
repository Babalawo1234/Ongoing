'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { updateUserCourse } from '@/app/lib/courseData';
import { GamificationManager } from '@/app/lib/gamification';
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
  semester?: number;
  status: CourseStatus;
  completed: boolean;
  grade: Grade;
}


export default function CheckSheetPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load user-specific courses
  useEffect(() => {
    if (!user) return;
    
    const loadCourses = async () => {
      setLoading(true);
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      
      // Debug logging for Master's students
      if (user.degreeType && (user.degreeType.startsWith('M.') || user.degreeType.includes('Master'))) {
        console.log(`Loading courses for Master's student: ${user.name}`);
        console.log(`Degree Type: ${user.degreeType}`);
        console.log(`Course/Major: ${user.course}`);
        console.log(`Saved courses:`, saved ? JSON.parse(saved) : 'None');
      }
      
      if (saved) {
        try {
          const userCourses = JSON.parse(saved);
          // Map to Course format with status
          const mappedCourses = userCourses.map((c: any) => ({
            ...c,
            status: c.completed ? 'Completed' : 'Not Started'
          }));
          setCourses(mappedCourses);
        } catch (e) {
          console.error('Failed to parse courses:', e);
        }
      } else if (user.course) {
        // Initialize courses for existing users who don't have courses yet
        const { initializeUserCourses } = await import('@/app/lib/courseData');
        initializeUserCourses(user.id, user.course, user.degreeType);
        const newSaved = localStorage.getItem(userCoursesKey);
        if (newSaved) {
          const userCourses = JSON.parse(newSaved);
          const mappedCourses = userCourses.map((c: any) => ({
            ...c,
            status: c.completed ? 'Completed' : 'Not Started'
          }));
          setCourses(mappedCourses);
        }
      }
      setLoading(false);
    };
    
    loadCourses();

    // Listen for updates
    const handleStorage = () => {
      const userCoursesKey = `user_courses_${user.id}`;
      const saved = localStorage.getItem(userCoursesKey);
      if (saved) {
        const userCourses = JSON.parse(saved);
        const mappedCourses = userCourses.map((c: any) => ({
          ...c,
          status: c.completed ? 'Completed' : 'Not Started'
        }));
        setCourses(mappedCourses);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  const updateStatus = (courseId: string, newStatus: CourseStatus) => {
    if (!user) return;

    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            status: newStatus,
            completed: newStatus === 'Completed',
            grade: newStatus !== 'Completed' ? '' : course.grade,
          }
        : course
    );

    setCourses(updatedCourses);

    // Update in localStorage with shared storage
    const userCoursesKey = `user_courses_${user.id}`;
    localStorage.setItem(userCoursesKey, JSON.stringify(updatedCourses));

    // Dispatch BOTH native storage event AND custom event for real-time sync
    window.dispatchEvent(new Event('storage'));
    const customEvent = new CustomEvent('aun-storage-change', {
      detail: { key: userCoursesKey, value: JSON.stringify(updatedCourses) },
    });
    window.dispatchEvent(customEvent);

    // Update student_grades if completed
    if (newStatus === 'Completed') {
      updateStudentGrades(courseId, updatedCourses);
    }
  };

  const updateGrade = (courseId: string, grade: Grade) => {
    if (!user) return;

    const updatedCourses = courses.map((course) =>
      course.id === courseId ? { ...course, grade, completed: true, status: 'Completed' } : course
    );

    setCourses(updatedCourses);

    // Update in localStorage with shared storage
    const userCoursesKey = `user_courses_${user.id}`;
    localStorage.setItem(userCoursesKey, JSON.stringify(updatedCourses));

    // Dispatch BOTH native storage event AND custom event for real-time sync
    window.dispatchEvent(new Event('storage'));
    const customEvent = new CustomEvent('aun-storage-change', {
      detail: { key: userCoursesKey, value: JSON.stringify(updatedCourses) },
    });
    window.dispatchEvent(customEvent);

    // Update student_grades for Admin/Academic visibility
    updateStudentGrades(courseId, updatedCourses);

    // Trigger Gamification Update if grade is passing
    if (grade && grade !== 'F' && grade !== 'E') {
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        const manager = new GamificationManager(user.id);
        manager.processCourseCompletion(grade, course.credits);
      }
    }
  };

  // Helper function to sync grades to student_grades storage
  const updateStudentGrades = (courseId: string, updatedCourses: any[]) => {
    if (!user) return;

    const course = updatedCourses.find((c) => c.id === courseId);
    if (!course || !course.grade) return;

    // Get existing grades
    const storedGrades = localStorage.getItem('student_grades');
    const allGrades = storedGrades ? JSON.parse(storedGrades) : [];

    // Check if grade already exists
    const existingGradeIndex = allGrades.findIndex(
      (g: any) => g.studentId === user.id && g.courseId === courseId
    );

    const gradeEntry = {
      studentId: user.id,
      courseId: courseId,
      grade: course.grade,
      credits: course.credits || 0,
      completedAt: new Date().toISOString(),
    };

    if (existingGradeIndex >= 0) {
      // Update existing grade
      allGrades[existingGradeIndex] = gradeEntry;
    } else {
      // Add new grade
      allGrades.push(gradeEntry);
    }

    // Save back to localStorage
    localStorage.setItem('student_grades', JSON.stringify(allGrades));

    // Dispatch custom event for real-time sync
    const customEvent = new CustomEvent('aun-storage-change', {
      detail: { key: 'student_grades', value: JSON.stringify(allGrades) },
    });
    window.dispatchEvent(customEvent);
  };

  const resetData = async () => {
    if (!user || !user.course) return;

    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      const userCoursesKey = `user_courses_${user.id}`;
      localStorage.removeItem(userCoursesKey);
      
      // Reinitialize courses
      const { initializeUserCourses } = await import('@/app/lib/courseData');
      initializeUserCourses(user.id, user.course);
      
      const newSaved = localStorage.getItem(userCoursesKey);
      if (newSaved) {
        const userCourses = JSON.parse(newSaved);
        const mappedCourses = userCourses.map((c: any) => ({
          ...c,
          status: c.completed ? 'Completed' : 'Not Started'
        }));
        setCourses(mappedCourses);
      }
      
      window.dispatchEvent(new Event('storage'));
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

  const refreshCourses = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Force reinitialize courses
    const { db } = await import('@/app/lib/normalizedDatabase');
    db.forceReinitializeStudentCourses(user.id, user.course || '', user.degreeType);
    
    // Reload courses
    const userCoursesKey = `user_courses_${user.id}`;
    const saved = localStorage.getItem(userCoursesKey);
    if (saved) {
      const userCourses = JSON.parse(saved);
      const mappedCourses = userCourses.map((c: any) => ({
        ...c,
        status: c.completed ? 'Completed' : 'Not Started'
      }));
      setCourses(mappedCourses);
    }
    
    setLoading(false);
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

  // Include all possible levels including Master's levels
  const isMasters = user?.degreeType && (user.degreeType.startsWith('M.') || user.degreeType.includes('Master') || user.degreeType.includes('MBA'));

  let sections: string[] = [];
  if (isMasters) {
    sections = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];
    // Filter to only show semesters that have courses
    sections = sections.filter(sem => {
       const semNum = parseInt(sem.split(' ')[1]);
       return courses.some(c => c.semester === semNum);
    });
  } else {
     // Ensure 100L-400L are always shown
     sections = ['100L', '200L', '300L', '400L'];
  }

  const filteredCourses = selectedLevel === 'all' 
    ? courses 
    : courses.filter(c => {
        if (isMasters && selectedLevel.startsWith('Semester')) {
           const semNum = parseInt(selectedLevel.split(' ')[1]);
           return c.semester === semNum;
        }
        return c.level === selectedLevel;
      });

  const groupedCourses = sections.reduce((acc, section) => {
    if (isMasters) {
       const semNum = parseInt(section.split(' ')[1]);
       acc[section] = courses.filter(c => c.semester === semNum);
    } else {
       acc[section] = courses.filter(c => c.level === section);
    }
    return acc;
  }, {} as Record<string, Course[]>);

  const calculateSectionStats = (section: string) => {
    const sectionCourses = groupedCourses[section] || [];
    const completed = sectionCourses.filter(c => c.completed).length;
    const total = sectionCourses.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Check Sheet</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Track your course completion and grades</p>
            {user && user.course && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {user.name} • {user.course} • {courses.length} Total Courses
              </p>
            )}
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
          {isMasters ? 'All Semesters' : 'All Levels'}
        </button>
        {sections.map(section => {
          const stats = calculateSectionStats(section);
          return (
            <button
              key={section}
              onClick={() => setSelectedLevel(section)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedLevel === section
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {section} ({stats.completed}/{stats.total})
            </button>
          );
        })}
      </div>

      {/* Course Levels */}
      {selectedLevel === 'all' ? (
        <div className="space-y-8">
          {sections.map(section => {
            const sectionCourses = groupedCourses[section];
            const stats = calculateSectionStats(section);
            const gpa = calculateGPA(sectionCourses);

            return (
              <div key={section} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{section} Courses</h2>
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
                    {sectionCourses.map(course => (
                      <CourseItem
                        key={course.id}
                        course={course}
                        onStatusChange={updateStatus}
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
                onStatusChange={updateStatus}
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
