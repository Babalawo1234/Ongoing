'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  AcademicCapIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { db } from '@/app/lib/normalizedDatabase';
import type { Program, Department, CatalogYear } from '@/app/lib/normalizedDatabase';

export default function ProgramsManagementPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [catalogYears, setCatalogYears] = useState<CatalogYear[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    program_name: '',
    degree_type: '',
    total_credits_required: 120,
    catalog_year_id: 1,
    department_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPrograms(db.getPrograms());
    setDepartments(db.getDepartments());
    setCatalogYears(db.getCatalogYears());
  };

  const openModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        program_name: program.program_name,
        degree_type: program.degree_type,
        total_credits_required: program.total_credits_required,
        catalog_year_id: program.catalog_year_id,
        department_id: program.department_id,
      });
    } else {
      setEditingProgram(null);
      setFormData({
        program_name: '',
        degree_type: 'Bachelor of Science',
        total_credits_required: 120,
        catalog_year_id: catalogYears.find(cy => cy.is_active)?.catalog_year_id || 1,
        department_id: departments[0]?.department_id || 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const programsData = db.getPrograms();

    if (editingProgram) {
      // Update existing program
      const updatedPrograms = programsData.map(p =>
        p.program_id === editingProgram.program_id
          ? { ...p, ...formData }
          : p
      );
      localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      alert('Program updated successfully!');
    } else {
      // Add new program
      const newProgram: Program = {
        program_id: Math.max(...programsData.map(p => p.program_id), 0) + 1,
        ...formData,
      };
      const updatedPrograms = [...programsData, newProgram];
      localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      alert('Program created successfully! You can now add courses to this program.');
    }

    loadData();
    closeModal();
  };

  const schools = Array.from(new Set(departments.map(d => d.school)));

  const filteredPrograms = programs.filter((program) => {
    const department = departments.find(d => d.department_id === program.department_id);
    const matchesSchool = filterSchool === 'all' || department?.school === filterSchool;
    const matchesSearch =
      program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.degree_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSchool && matchesSearch;
  });

  return (
    <div className="page-content">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Program Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage academic programs and degrees</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Schools</option>
          {schools.map(school => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5" />
          Add Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Programs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{programs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Schools</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{schools.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredPrograms.length}</p>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm || filterSchool !== 'all' ? 'No programs found' : 'No programs added yet'}
            </p>
          </div>
        ) : (
          filteredPrograms.map((program) => {
            const department = departments.find(d => d.department_id === program.department_id);
            const catalogYear = catalogYears.find(cy => cy.catalog_year_id === program.catalog_year_id);
            const programCourses = db.getCoursesForProgram(program.program_id);

            return (
              <div
                key={program.program_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold rounded">
                        {program.degree_type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{program.program_name}</h3>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Department:</span> {department?.department_name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">School:</span> {department?.school || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Required Credits:</span> {program.total_credits_required}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Catalog Year:</span> {catalogYear?.year || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Courses:</span> {programCourses.length}
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openModal(program)}
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

      {/* Add/Edit Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingProgram ? 'Edit Program' : 'Add New Program'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Program Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.program_name}
                      onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Degree Type
                    </label>
                    <select
                      required
                      value={formData.degree_type}
                      onChange={(e) => setFormData({ ...formData, degree_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Bachelor of Science">Bachelor of Science</option>
                      <option value="Bachelor of Arts">Bachelor of Arts</option>
                      <option value="Bachelor of Engineering">Bachelor of Engineering</option>
                      <option value="Bachelor of Technology">Bachelor of Technology</option>
                      <option value="Master of Science">Master of Science</option>
                      <option value="Master of Arts">Master of Arts</option>
                      <option value="Master of Engineering">Master of Engineering</option>
                      <option value="MBA">Master of Business Administration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Credits Required
                    </label>
                    <input
                      type="number"
                      required
                      min="60"
                      max="200"
                      value={formData.total_credits_required}
                      onChange={(e) => setFormData({ ...formData, total_credits_required: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      required
                      value={formData.department_id}
                      onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={0}>Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.department_id} value={dept.department_id}>
                          {dept.department_name} ({dept.school})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Catalog Year
                    </label>
                    <select
                      required
                      value={formData.catalog_year_id}
                      onChange={(e) => setFormData({ ...formData, catalog_year_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      {catalogYears.map(cy => (
                        <option key={cy.catalog_year_id} value={cy.catalog_year_id}>
                          {cy.year} {cy.is_active ? '(Active)' : ''}
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
                    {editingProgram ? 'Update' : 'Create'} Program
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
