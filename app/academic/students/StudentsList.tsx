'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Student {
    id: string;
    name: string;
    fullName: string | null;
    email: string;
    studentId: string | null;
    school: string | null;
    department: string | null;
}

export default function StudentsList({ initialStudents }: { initialStudents: Student[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/academic/students?search=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search students by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
        </form>
    );
}
