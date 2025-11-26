'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { db } from '@/app/lib/normalizedDatabase';
import type { Course, Program } from '@/app/lib/normalizedDatabase';

interface ExtendedCourse extends Course {
  program_id?: number;
  year_required?: number;
  semester?: number;
  core?: boolean;
  elective?: boolean;
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    credits: 3,
    department_id: 0,
  });

  // Assignment modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    program_id: 0,
    year_required: 1,
    semester: 1,
    core: true,
    is_gened: false,
    is_major: true,
    elective: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCourses(db.getCourses());
    setPrograms(db.getPrograms());
    setDepartments(db.getDepartments());
  };

  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        course_code: course.course_code,
        course_name: course.course_name,
        credits: course.credits,
        department_id: course.department_id,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        course_code: '',
        course_name: '',
        credits: 3,
        department_id: departments[0]?.department_id || 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to normalized database
    const coursesData = db.getCourses();
    
    if (editingCourse) {
      // Update existing course
      const updatedCourses = coursesData.map(c =>
        c.course_id === editingCourse.course_id
          ? { ...c, ...formData }
          : c
      );
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    } else {
      // Add new course
      const newCourse: Course = {
        course_id: Math.max(...coursesData.map(c => c.course_id), 0) + 1,
        ...formData,
      };
      const updatedCourses = [...coursesData, newCourse];
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    }

    loadData();
    closeModal();
  };

  const openAssignModal = (course: Course) => {
    setSelectedCourse(course);
    setIsAssignModalOpen(true);
  };

  const handleAssignCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) return;

    // Get existing program courses
    const programCourses = db.getProgramCourses();
    
    // Check if already assigned
    const exists = programCourses.some(
      pc => pc.program_id === assignmentData.program_id && pc.course_id === selectedCourse.course_id
    );

    if (exists) {
      alert('This course is already assigned to this program!');
      return;
    }

    // Add new assignment
    const newAssignment = {
      program_id: assignmentData.program_id,
      course_id: selectedCourse.course_id,
      core: assignmentData.core,
      is_gened: assignmentData.is_gened,
      is_major: assignmentData.is_major,
      elective: assignmentData.elective,
      year_required: assignmentData.year_required,
      semester: assignmentData.semester,
      concentration: null,
    };

    const updatedProgramCourses = [...programCourses, newAssignment];
    localStorage.setItem('program_courses', JSON.stringify(updatedProgramCourses));

    alert('Course assigned successfully!');
    setIsAssignModalOpen(false);
    setSelectedCourse(null);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesDepartment = filterDepartment === 'all' || course.department_id === filterDepartment;
    const matchesSearch =
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="page-content">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Add, edit, and assign courses to programs</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.department_id} value={dept.department_id}>
              {dept.department_name}
            </option>
          ))}
        </select>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5" />
          Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {courses.reduce((sum, c) => sum + c.credits, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredCourses.length}</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm || filterDepartment !== 'all' ? 'No courses found' : 'No courses added yet'}
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const department = departments.find(d => d.department_id === course.department_id);
            return (
              <div
                key={course.course_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold rounded">
                        {course.course_code}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{course.course_name}</h3>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Credits:</span> {course.credits}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Department:</span> {department?.department_name || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openAssignModal(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Assign
                  </button>
                  <button
                    onClick={() => openModal(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.course_code}
                      onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., CS101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Credits
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="6"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.course_name}
                      onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      required
                      value={formData.department_id}
                      onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.department_id} value={dept.department_id}>
                          {dept.department_name} ({dept.school})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingCourse ? 'Update' : 'Add'} Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Course Modal */}
      {isAssignModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAssignModalOpen(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Assign to Program: {selectedCourse.course_code}
                </h3>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAssignCourse} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Program
                    </label>
                    <select
                      required
                      value={assignmentData.program_id}
                      onChange={(e) => setAssignmentData({ ...assignmentData, program_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={0}>Select Program</option>
                      {programs.map(prog => (
                        <option key={prog.program_id} value={prog.program_id}>
                          {prog.program_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Year
                      </label>
                      <select
                        required
                        value={assignmentData.year_required}
                        onChange={(e) => setAssignmentData({ ...assignmentData, year_required: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value={1}>Year 1</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Semester
                      </label>
                      <select
                        required
                        value={assignmentData.semester}
                        onChange={(e) => setAssignmentData({ ...assignmentData, semester: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value={1}>Semester 1</option>
                        <option value={2}>Semester 2</option>
                        <option value={3}>Semester 3</option>
                        <option value={4}>Semester 4</option>
                        <option value={5}>Semester 5</option>
                        <option value={6}>Semester 6</option>
                        <option value={7}>Semester 7</option>
                        <option value={8}>Semester 8</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={assignmentData.core}
                        onChange={(e) => setAssignmentData({ ...assignmentData, core: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Core Course</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={assignmentData.elective}
                        onChange={(e) => setAssignmentData({ ...assignmentData, elective: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Elective</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Assign Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
