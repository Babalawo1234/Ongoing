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

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  level: string;
  school: string;
  semester: string;
  description: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: 3,
    level: '',
    school: '',
    semester: '',
    description: '',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    const storedCourses = localStorage.getItem('admin_courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    }
  };

  const saveCourses = (coursesToSave: Course[]) => {
    localStorage.setItem('admin_courses', JSON.stringify(coursesToSave));
    setCourses(coursesToSave);
  };

  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        code: course.code,
        title: course.title,
        credits: course.credits,
        level: course.level,
        school: course.school,
        semester: course.semester,
        description: course.description,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        code: '',
        title: '',
        credits: 3,
        level: '',
        school: '',
        semester: '',
        description: '',
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

    if (editingCourse) {
      const updatedCourses = courses.map((c) =>
        c.id === editingCourse.id ? { ...c, ...formData } : c
      );
      saveCourses(updatedCourses);
    } else {
      const newCourse: Course = {
        ...formData,
        id: `course-${Date.now()}`,
      };
      saveCourses([...courses, newCourse]);
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const filteredCourses = courses.filter((c) => c.id !== id);
      saveCourses(filteredCourses);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      (filterLevel === 'all' || course.level === filterLevel) &&
      (course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <p className="mt-2 text-gray-600">Manage course catalog and offerings</p>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Levels</option>
          <option value="100L">100 Level</option>
          <option value="200L">200 Level</option>
          <option value="300L">300 Level</option>
          <option value="400L">400 Level</option>
          <option value="500L">500 Level</option>
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
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Courses</p>
          <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Credits</p>
          <p className="text-2xl font-bold text-gray-900">
            {courses.reduce((sum, c) => sum + c.credits, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Schools</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(courses.map((c) => c.school)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Filtered Results</p>
          <p className="text-2xl font-bold text-gray-900">{filteredCourses.length}</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600">
              {searchTerm || filterLevel !== 'all' ? 'No courses found' : 'No courses added yet'}
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded">
                      {course.code}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Credits:</span> {course.credits}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">School:</span> {course.school}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Semester:</span> {course.semester}
                </p>
                {course.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                )}
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => openModal(course)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., CS101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credits
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="6"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Level</option>
                      <option value="100L">100 Level</option>
                      <option value="200L">200 Level</option>
                      <option value="300L">300 Level</option>
                      <option value="400L">400 Level</option>
                      <option value="500L">500 Level</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester
                    </label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Semester</option>
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School/Department
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., School of Arts and Sciences"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Course description..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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
    </div>
  );
}
