'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    AcademicCapIcon,
    ChartBarIcon,
    BookOpenIcon,
    ClockIcon,
    EyeIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { ActivityTracker } from '@/app/lib/activityTracker';
import type { ActivitySummary } from '@/app/lib/activityTracker';
import { subscribeToStorageChanges } from '@/app/lib/sharedStorage';

interface Student {
    id: string;
    name: string;
    email: string;
    studentId?: string;
    fullName?: string;
    school?: string;
    course?: string;
    yearOfStudy?: string;
}

interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
    level?: string;
}

interface Grade {
    studentId: string;
    courseId: string;
    grade: string;
    semester?: string;
    year?: string;
}

export default function AcademicStudentProgressPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;

    const [student, setStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);
    const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Load student data function
    const loadStudentData = useCallback(() => {
        if (!studentId) return;
        
        setIsRefreshing(true);

        // Load student data
        const storedUsers = localStorage.getItem('aun_checksheet_users');
        if (storedUsers) {
            const allUsers = JSON.parse(storedUsers);
            const foundStudent = allUsers.find((u: any) => u.id === studentId);
            if (foundStudent) {
                setStudent(foundStudent);
            }
        }

        // Load student's courses
        const userCoursesKey = `user_courses_${studentId}`;
        const savedCourses = localStorage.getItem(userCoursesKey);
        if (savedCourses) {
            setCourses(JSON.parse(savedCourses));
        }

        // Load grades
        const storedGrades = localStorage.getItem('student_grades');
        if (storedGrades) {
            const allGrades = JSON.parse(storedGrades);
            const studentGrades = allGrades.filter((g: Grade) => g.studentId === studentId);
            setGrades(studentGrades);
        }

        // Load student activity
        const summary = ActivityTracker.getActivitySummary(studentId);
        setActivitySummary(summary);

        setLoading(false);
        setLastUpdate(new Date());
        setIsRefreshing(false);
    }, [studentId]);

    // Initial load
    useEffect(() => {
        loadStudentData();
    }, [loadStudentData]);

    // Real-time updates: Subscribe to storage changes
    useEffect(() => {
        const unsubscribe = subscribeToStorageChanges((key, value) => {
            if (
                key === 'aun_checksheet_users' ||
                key === 'student_grades' ||
                key === `user_courses_${studentId}`
            ) {
                loadStudentData();
            }
        });

        return unsubscribe;
    }, [loadStudentData, studentId]);

    // Auto-refresh every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadStudentData();
        }, 5000);

        return () => clearInterval(interval);
    }, [loadStudentData]);

    const getGradeForCourse = (courseId: string) => {
        // First check student_grades storage
        const gradeFromStorage = grades.find(g => g.courseId === courseId);
        if (gradeFromStorage?.grade) return gradeFromStorage.grade;
        
        // Then check if grade is stored in course object itself (student interface stores it here)
        const course = courses.find(c => c.id === courseId);
        if (course && (course as any).grade) return (course as any).grade;
        
        return null;
    };

    const calculateGPA = () => {
        const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
        let totalPoints = 0;
        let totalCredits = 0;

        grades.forEach((g) => {
            const course = courses.find((c) => c.id === g.courseId);
            if (course && gradePoints[g.grade] !== undefined) {
                totalPoints += gradePoints[g.grade] * course.credits;
                totalCredits += course.credits;
            }
        });

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    const calculateCredits = () => {
        const completedCourses = courses.filter(c => getGradeForCourse(c.id));
        const earnedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
        const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
        return { earned: earnedCredits, total: totalCredits };
    };

    const completedCount = courses.filter(c => getGradeForCourse(c.id)).length;
    const credits = calculateCredits();
    const gpa = calculateGPA();

    // Group courses by level
    const coursesByLevel: { [key: string]: Course[] } = {};
    courses.forEach((course) => {
        const level = course.level || 'Other';
        if (!coursesByLevel[level]) {
            coursesByLevel[level] = [];
        }
        coursesByLevel[level].push(course);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Student not found</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/academic/students"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Students
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {student.fullName || student.name}
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{student.email}</p>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                <EyeIcon className="h-4 w-4" />
                                <span>View-Only Access</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                                <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                <span>Real-Time (5s)</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last updated</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {lastUpdate.toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Student Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <AcademicCapIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">GPA</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{gpa}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {completedCount}/{courses.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Credits Earned</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{credits.earned}/{credits.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Program</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {student.course || 'Not Enrolled'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {student.school}
                        </p>
                    </div>
                </div>
            </div>

            {/* Student Activity Section */}
            {activitySummary && (
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <EyeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            Student Interface Activity
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Track what this student has done on their interface
                        </p>
                    </div>
                    <div className="p-6">
                        {/* Activity Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Activities</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activitySummary.totalActivities}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <p className="text-xs text-blue-600 dark:text-blue-400 uppercase">Courses Viewed</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{activitySummary.coursesViewed}</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <p className="text-xs text-green-600 dark:text-green-400 uppercase">Progress Checked</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">{activitySummary.progressChecked}</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                <p className="text-xs text-purple-600 dark:text-purple-400 uppercase">Grades Viewed</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300 mt-1">{activitySummary.gradesViewed}</p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                                <p className="text-xs text-orange-600 dark:text-orange-400 uppercase">Last Active</p>
                                <p className="text-sm font-bold text-orange-900 dark:text-orange-300 mt-1">{activitySummary.lastActive}</p>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
                            {activitySummary.recentActivities.length === 0 ? (
                                <div className="text-center py-8">
                                    <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">No activities recorded yet</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        Activities will appear here when the student uses their interface
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {activitySummary.recentActivities.map((activity) => {
                                        const style = ActivityTracker.getActionStyle(activity.action);
                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className={`flex-shrink-0 w-10 h-10 ${style.bgColor} rounded-lg flex items-center justify-center text-xl`}>
                                                    {style.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {activity.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {ActivityTracker.formatTimestamp(activity.timestamp)}
                                                    </p>
                                                    {activity.metadata && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            {JSON.stringify(activity.metadata)}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${style.bgColor} ${style.color} font-medium`}>
                                                    {activity.action.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Courses by Semester */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Progress</h2>

                {courses.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-gray-600 dark:text-gray-400">No courses assigned yet</p>
                    </div>
                ) : (
                    Object.entries(coursesByLevel)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([level, levelCourses]) => (
                            <div key={level} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {level}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Course Code
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Course Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Credits
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Grade
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {levelCourses.map((course) => {
                                                const grade = getGradeForCourse(course.id);
                                                return (
                                                    <tr key={course.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                            {course.code}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                            {course.title}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {course.credits}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {grade ? (
                                                                <span
                                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                        grade === 'A'
                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                            : grade === 'B'
                                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                                                : grade === 'C'
                                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                                    : grade === 'D' || grade === 'E'
                                                                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                                    }`}
                                                                >
                                                                    {grade}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {grade ? (
                                                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                                                                    Completed
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs font-semibold">
                                                                    In Progress
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}
