'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { AcademicCapIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Course curriculum mapping by school
const SCHOOL_COURSES: Record<string, string[]> = {
  'Engineering': [
    'Petroleum Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
  ],
  'Arts & Sciences': [
    'Mass Communication',
    'English Language',
    'International Relations',
    'Economics',
    'Mathematics',
    'Chemistry',
    'Biology',
    'Physics',
  ],
  'Business & Entrepreneurship': [
    'Accounting',
    'Business Administration',
    'Finance',
    'Marketing',
    'Entrepreneurship',
    'Management',
  ],
  'IT & Computing': [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Cybersecurity',
    'Data Science',
  ],
};

export default function SignupPage() {
  const { user, signup, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    yearOfStudy: '',
    catalogYear: '',
    school: '',
    course: '',
    degreeType: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If school changes, reset course selection
    if (name === 'school') {
      setFormData({
        ...formData,
        school: value,
        course: '', // Reset course when school changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    // Email validation - must be @aun.edu.ng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Domain validation - only AUN emails allowed
    if (!formData.email.toLowerCase().endsWith('@aun.edu.ng')) {
      setError('Only AUN email addresses (@aun.edu.ng) are allowed');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.studentId.trim()) {
      setError('Please enter your student ID');
      return;
    }

    if (!formData.yearOfStudy) {
      setError('Please select your year of study');
      return;
    }

    if (!formData.catalogYear) {
      setError('Please enter your catalog year');
      return;
    }

    if (!formData.school) {
      setError('Please select your school');
      return;
    }

    if (!formData.course.trim()) {
      setError('Please enter your course/major');
      return;
    }

    if (!formData.degreeType) {
      setError('Please select your degree type');
      return;
    }
    
    // Degree type validation based on level
    const isMastersDegree = formData.degreeType.startsWith('M.');
    const isUndergrad = ['100', '200', '300', '400'].includes(formData.yearOfStudy);
    const isPostgrad = ['500', '600'].includes(formData.yearOfStudy);
    
    if (isMastersDegree && isUndergrad) {
      setError('Master\'s degree students must select 500 or 600 level');
      return;
    }
    
    if (!isMastersDegree && isPostgrad) {
      setError('Postgraduate levels require a Master\'s degree type');
      return;
    }

    setSubmitting(true);
    const result = await signup({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      studentId: formData.studentId.trim(),
      yearOfStudy: formData.yearOfStudy,
      catalogYear: formData.catalogYear,
      school: formData.school,
      course: formData.course.trim(),
      degreeType: formData.degreeType,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900 flex items-center justify-center px-4 py-12 transition-theme">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transition-theme">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <AcademicCapIcon className="h-9 w-9 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Join AUN Academic Check Sheet</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@aun.edu.ng"
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                required
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Student ID */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g., 2020001"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
              required
            />
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                required
              >
                <option value="">Select Year</option>
                <option value="100">100 Level (Undergraduate)</option>
                <option value="200">200 Level (Undergraduate)</option>
                <option value="300">300 Level (Undergraduate)</option>
                <option value="400">400 Level (Undergraduate)</option>
                <option value="500">500 Level (Master's Year 1)</option>
                <option value="600">600 Level (Master's Year 2)</option>
              </select>
            </div>

            <div>
              <label htmlFor="catalogYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Catalog Year <span className="text-red-500">*</span>
              </label>
              <select
                id="catalogYear"
                name="catalogYear"
                value={formData.catalogYear}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                required
              >
                <option value="">Select Catalog Year</option>
                <option value="2018">2018</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                School of Study <span className="text-red-500">*</span>
              </label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                required
              >
                <option value="">Select School</option>
                <option value="Engineering">School of Engineering</option>
                <option value="Arts & Sciences">School of Arts & Sciences</option>
                <option value="Business & Entrepreneurship">School of Business & Entrepreneurship</option>
                <option value="IT & Computing">School of IT & Computing</option>
              </select>
            </div>

            <div>
              <label htmlFor="degreeType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Degree Type <span className="text-red-500">*</span>
              </label>
              <select
                id="degreeType"
                name="degreeType"
                value={formData.degreeType}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme"
                required
              >
                <option value="">Select Degree</option>
                <optgroup label="Undergraduate Degrees">
                  <option value="B.Sc.">B.Sc. (Bachelor of Science)</option>
                  <option value="B.A.">B.A. (Bachelor of Arts)</option>
                  <option value="B.Eng.">B.Eng. (Bachelor of Engineering)</option>
                  <option value="B.Tech.">B.Tech. (Bachelor of Technology)</option>
                </optgroup>
                <optgroup label="Master's Degrees">
                  <option value="M.Sc.">M.Sc. (Master of Science)</option>
                  <option value="M.A.">M.A. (Master of Arts)</option>
                  <option value="M.Eng.">M.Eng. (Master of Engineering)</option>
                  <option value="MBA">MBA (Master of Business Administration)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course/Major <span className="text-red-500">*</span>
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              disabled={!formData.school}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-theme disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {formData.school ? 'Select Course/Major' : 'Select a school first'}
              </option>
              {formData.school && SCHOOL_COURSES[formData.school]?.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {formData.school && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Available courses in School of {formData.school}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {submitting || loading ? 'Creating Account…' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
