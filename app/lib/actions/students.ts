'use server';

import prisma from '@/app/lib/db';

export async function getAllStudents() {
    try {
        const students = await prisma.user.findMany({
            where: {
                role: 'student',
            },
            select: {
                id: true,
                email: true,
                name: true,
                fullName: true,
                studentId: true,
                school: true,
                department: true,
                catalog: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return students;
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

export async function getStudentWithProgress(studentId: string) {
    try {
        const student = await prisma.user.findUnique({
            where: { id: studentId },
            include: {
                studentPrograms: {
                    include: {
                        program: {
                            include: {
                                department: true,
                                catalogYear: true,
                            },
                        },
                    },
                },
                studentCourses: {
                    include: {
                        course: {
                            include: {
                                department: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!student) {
            return null;
        }

        // Calculate statistics
        const totalCourses = student.studentCourses.length;
        const completedCourses = student.studentCourses.filter(
            (sc) => sc.grade && sc.grade !== ''
        ).length;
        const totalCredits = student.studentCourses.reduce(
            (sum, sc) => sum + (sc.creditsEarned || 0),
            0
        );

        // Calculate GPA
        const gradePoints: { [key: string]: number } = {
            'A': 4.0,
            'A-': 3.7,
            'B+': 3.3,
            'B': 3.0,
            'B-': 2.7,
            'C+': 2.3,
            'C': 2.0,
            'C-': 1.7,
            'D+': 1.3,
            'D': 1.0,
            'F': 0.0,
        };

        let totalGradePoints = 0;
        let totalGradedCredits = 0;

        student.studentCourses.forEach((sc) => {
            if (sc.grade && gradePoints[sc.grade] !== undefined) {
                const courseCredits = sc.course.credits;
                totalGradePoints += gradePoints[sc.grade] * courseCredits;
                totalGradedCredits += courseCredits;
            }
        });

        const gpa = totalGradedCredits > 0 ? totalGradePoints / totalGradedCredits : 0;

        return {
            ...student,
            stats: {
                totalCourses,
                completedCourses,
                totalCredits,
                gpa: gpa.toFixed(2),
            },
        };
    } catch (error) {
        console.error('Error fetching student with progress:', error);
        return null;
    }
}

export async function updateStudentGrade(
    studentId: string,
    courseId: number,
    grade: string,
    semesterTaken: string
) {
    try {
        // Find the student course record
        const studentCourse = await prisma.studentCourse.findFirst({
            where: {
                studentId,
                courseId,
            },
            include: {
                course: true,
            },
        });

        if (!studentCourse) {
            throw new Error('Student course not found');
        }

        // Calculate credits earned based on grade
        const gradePoints: { [key: string]: number } = {
            'A': 4.0,
            'A-': 3.7,
            'B+': 3.3,
            'B': 3.0,
            'B-': 2.7,
            'C+': 2.3,
            'C': 2.0,
            'C-': 1.7,
            'D+': 1.3,
            'D': 1.0,
            'F': 0.0,
        };

        const creditsEarned = gradePoints[grade] !== undefined && grade !== 'F'
            ? studentCourse.course.credits
            : 0;

        // Update the student course
        await prisma.studentCourse.update({
            where: {
                id: studentCourse.id,
            },
            data: {
                grade,
                semesterTaken,
                creditsEarned,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating student grade:', error);
        return { success: false, error: 'Failed to update grade' };
    }
}
