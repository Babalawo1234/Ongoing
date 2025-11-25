'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { XMarkIcon, TrophyIcon, ExclamationTriangleIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface GPANotificationProps {
  onClose: () => void;
}

export default function GPANotification({ onClose }: GPANotificationProps) {
  const { user } = useAuth();
  const [gpa, setGpa] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [icon, setIcon] = useState<React.ReactElement>(<CheckCircleIcon className="w-16 h-16" />);
  const [gradient, setGradient] = useState<string>('');

  useEffect(() => {
    if (!user) return;

    // Calculate GPA from user's courses
    const userCoursesKey = `user_courses_${user.id}`;
    const saved = localStorage.getItem(userCoursesKey);
    
    if (saved) {
      const courses = JSON.parse(saved);
      const completed = courses.filter((c: any) => c.completed && c.grade);
      
      if (completed.length === 0) {
        setStatus('Getting Started');
        setMessage('Welcome! Complete your first course to see your GPA.');
        setIcon(<SparklesIcon className="w-16 h-16" />);
        setGradient('from-blue-500 to-indigo-600');
        return;
      }

      const gradePoints: any = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
      let totalPoints = 0;
      let totalCredits = 0;
      
      completed.forEach((course: any) => {
        if (course.grade && gradePoints[course.grade] !== undefined) {
          totalPoints += gradePoints[course.grade] * course.credits;
          totalCredits += course.credits;
        }
      });
      
      const calculatedGpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
      setGpa(calculatedGpa);

      // Determine status and message based on GPA
      if (calculatedGpa >= 4.5) {
        setStatus("Dean's List 🏆");
        setMessage('Outstanding performance! You\'re in the top tier. Keep up the excellent work!');
        setIcon(<TrophyIcon className="w-16 h-16" />);
        setGradient('from-yellow-400 to-orange-500');
      } else if (calculatedGpa >= 3.5) {
        setStatus('Excellent Standing 🌟');
        setMessage('Great job! Your GPA shows strong academic performance. Stay focused!');
        setIcon(<CheckCircleIcon className="w-16 h-16" />);
        setGradient('from-green-500 to-emerald-600');
      } else if (calculatedGpa >= 3.0) {
        setStatus('Good Standing ✅');
        setMessage('You\'re doing well! Consider aiming higher to reach excellence.');
        setIcon(<CheckCircleIcon className="w-16 h-16" />);
        setGradient('from-blue-500 to-cyan-600');
      } else if (calculatedGpa >= 2.0) {
        setStatus('Satisfactory 📚');
        setMessage('Your performance is acceptable, but there\'s room for improvement. Let\'s aim higher!');
        setIcon(<ExclamationTriangleIcon className="w-16 h-16" />);
        setGradient('from-yellow-500 to-amber-600');
      } else {
        setStatus('Action Required ⚠️');
        setMessage('Your GPA needs attention. Please meet with your academic advisor for guidance.');
        setIcon(<ExclamationTriangleIcon className="w-16 h-16" />);
        setGradient('from-red-500 to-pink-600');
      }
    }
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Header with Gradient */}
        <div className={`h-32 bg-gradient-to-r ${gradient} rounded-t-2xl flex items-center justify-center`}>
          <div className="text-white">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {status}
          </h2>
          
          {gpa > 0 && (
            <div className="mb-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {gpa.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current GPA (out of 5.0)
              </p>
            </div>
          )}

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>

          {/* Progress Bar */}
          {gpa > 0 && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
                  style={{ width: `${(gpa / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>0.0</span>
                <span>2.5</span>
                <span>5.0</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 bg-gradient-to-r ${gradient} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg`}
          >
            Continue to Dashboard
          </button>

          {/* Tips */}
          {gpa > 0 && gpa < 4.5 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                💡 <strong>Pro Tip:</strong> Complete more courses with higher grades to boost your GPA!
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
