'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { db } from '@/app/lib/normalizedDatabase';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

interface EnrichedCourse {
  course_id: number;
  course_code: string;
  course_name: string;
  credits: number;
  department_id: number;
  year_required?: number;
  semester?: number;
  core?: boolean;
  elective?: boolean;
}

export default function CourseCatalogPage() {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState<EnrichedCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<EnrichedCourse[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCourses();
    loadDepartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedDepartment, selectedLevel, selectedSemester, selectedType, allCourses]);

  const loadCourses = () => {
    const courses = db.getCourses();
    const programCourses = db.getProgramCourses();
    
    // Enrich courses with program data
    const enriched = courses.map(course => {
      const programCourse = programCourses.find(pc => pc.course_id === course.course_id);
      return {
        ...course,
        year_required: programCourse?.year_required,
        semester: programCourse?.semester,
        core: programCourse?.core,
        elective: programCourse?.elective,
      };
    });
    
    setAllCourses(enriched);
  };

  const loadDepartments = () => {
    const depts = db.getDepartments();
    setDepartments(depts);
  };

  const applyFilters = () => {
    let filtered = [...allCourses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(course => course.department_id === selectedDepartment);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      const levelNum = parseInt(selectedLevel);
      filtered = filtered.filter(course => course.year_required === levelNum);
    }

    // Semester filter
    if (selectedSemester !== 'all') {
      filtered = filtered.filter(course => course.semester === selectedSemester);
    }

    // Type filter (core/elective)
    if (selectedType === 'core') {
      filtered = filtered.filter(course => course.core === true);
    } else if (selectedType === 'elective') {
      filtered = filtered.filter(course => course.elective === true);
    }

    setFilteredCourses(filtered);
  };

  const getDepartmentName = (deptId: number) => {
    const dept = departments.find(d => d.department_id === deptId);
    return dept?.department_name || 'Unknown';
  };

  const getDepartmentSchool = (deptId: number) => {
    const dept = departments.find(d => d.department_id === deptId);
    return dept?.school || 'Unknown';
  };

  const getLevelLabel = (year?: number) => {
    if (!year) return 'N/A';
    return `${year}00L`;
  };

  const getSemesterLabel = (semester?: number) => {
    if (!semester) return 'N/A';
    return `Semester ${semester}`;
  };

  const groupByDepartment = () => {
    const grouped: Record<number, EnrichedCourse[]> = {};
    filteredCourses.forEach(course => {
      if (!grouped[course.department_id]) {
        grouped[course.department_id] = [];
      }
      grouped[course.department_id].push(course);
    });
    return grouped;
  };

  const groupedCourses = groupByDepartment();

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
          Course Catalog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse all available courses across all departments
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by course code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FunnelIcon className="h-5 w-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="1">100L</option>
                <option value="2">200L</option>
                <option value="3">300L</option>
                <option value="4">400L</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="core">Core Courses</option>
                <option value="elective">Electives</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredCourses.length} of {allCourses.length} courses
      </div>

      {/* Courses Grouped by Department */}
      <div className="space-y-8">
        {Object.keys(groupedCourses).length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search term
            </p>
          </div>
        ) : (
          Object.entries(groupedCourses).map(([deptId, courses]) => (
            <div key={deptId} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Department Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BuildingLibraryIcon className="h-6 w-6" />
                    <div>
                      <h2 className="text-xl font-bold">{getDepartmentName(parseInt(deptId))}</h2>
                      <p className="text-sm opacity-90">{getDepartmentSchool(parseInt(deptId))}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{courses.length}</p>
                    <p className="text-sm opacity-90">Courses</p>
                  </div>
                </div>
              </div>

              {/* Courses List */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map(course => (
                    <div
                      key={course.course_id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {course.course_code}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {course.course_name}
                          </p>
                        </div>
                        <div className="ml-2">
                          <AcademicCapIcon className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                          {course.credits} Credits
                        </span>
                        {course.year_required && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                            {getLevelLabel(course.year_required)}
                          </span>
                        )}
                        {course.semester && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded">
                            Sem {course.semester}
                          </span>
                        )}
                        {course.core && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded">
                            Core
                          </span>
                        )}
                        {course.elective && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                            Elective
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
