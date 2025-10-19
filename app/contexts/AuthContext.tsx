"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "student" | "academic";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  yearOfStudy?: string;
  catalogYear?: string;
  school?: string;
  course?: string;
  degreeType?: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  studentId: string;
  yearOfStudy: string;
  catalogYear: string;
  school: string;
  course: string;
  degreeType: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'aun_checksheet_users'; // Keep in localStorage
const CURRENT_USER_KEY = 'aun_checksheet_current_user'; // Will use sessionStorage

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load current user from sessionStorage (persists during session only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check sessionStorage for active session
      const storedUser = sessionStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          sessionStorage.removeItem(CURRENT_USER_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  // Get all users from localStorage
  const getStoredUsers = (): StoredUser[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse users:', e);
      return [];
    }
  };

  // Save users to localStorage
  const saveUsers = (users: StoredUser[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  };

  // Save current user session to sessionStorage (not localStorage)
  const saveCurrentUser = (currentUser: User | null) => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  };

  const signup = async (data: SignupData) => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 600));

      const users = getStoredUsers();

      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, error: "An account with this email already exists" };
      }

      // Create new user
      const newUser: StoredUser = {
        id: `stu-${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        role: "student",
        studentId: data.studentId,
        yearOfStudy: data.yearOfStudy,
        catalogYear: data.catalogYear,
        school: data.school,
        course: data.course,
        degreeType: data.degreeType,
      };

      // Save to localStorage
      users.push(newUser);
      saveUsers(users);

      // Initialize courses for this user based on their major
      if (typeof window !== 'undefined') {
        const { initializeUserCourses } = await import('@/app/lib/courseData');
        initializeUserCourses(newUser.id, data.course);
      }

      // Log the user in
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      saveCurrentUser(userWithoutPassword);

      router.replace("/dashboard");
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: "Unable to create account. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Basic validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: "Please enter a valid email address" };
      }
      if (!password || password.length < 3) {
        return { success: false, error: "Password is required" };
      }

      // Simulate network delay
      await new Promise((r) => setTimeout(r, 600));

      const normalizedEmail = email.toLowerCase().trim();

      // Admin credentials
      if (normalizedEmail === "admin@aun.edu.ng" && password === "admin") {
        const adminUser: User = {
          id: "admin-1",
          name: "Administrator",
          email: normalizedEmail,
          role: "admin",
        };
        setUser(adminUser);
        saveCurrentUser(adminUser);
        router.replace("/admin");
        return { success: true };
      }

      // Academic Advisor credentials
      if (normalizedEmail === "academic@aun.edu.ng" && password === "academic") {
        const academicUser: User = {
          id: "academic-1",
          name: "Academic Advisor",
          email: normalizedEmail,
          role: "academic",
        };
        setUser(academicUser);
        saveCurrentUser(academicUser);
        router.replace("/academic");
        return { success: true };
      }

      // Check registered users
      const users = getStoredUsers();
      const foundUser = users.find(u => u.email === normalizedEmail);

      if (foundUser) {
        // Verify password
        if (foundUser.password === password) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          saveCurrentUser(userWithoutPassword);
          router.replace("/dashboard");
          return { success: true };
        } else {
          return { success: false, error: "Invalid password" };
        }
      }

      return { success: false, error: "No account found with this email. Please sign up first." };
    } catch (e) {
      console.error(e);
      return { success: false, error: "Unable to login. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    saveCurrentUser(null);
    router.replace("/login");
  };

  const updateUser = (userData: Partial<User>): boolean => {
    if (!user) return false;

    try {
      // Update user in localStorage
      const users = getStoredUsers();
      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          return { ...u, ...userData };
        }
        return u;
      });
      saveUsers(updatedUsers);

      // Update current user state and session
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      saveCurrentUser(updatedUser);

      return true;
    } catch (e) {
      console.error('Failed to update user:', e);
      return false;
    }
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout, updateUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
