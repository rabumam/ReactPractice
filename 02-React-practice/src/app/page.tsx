"use client";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import UserDashboard from "../components/UserDashboard";
import { IUser } from "./types";
import { motion } from "framer-motion";

const SunIcon = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ rotate: 0, scale: 1 }}
    animate={{ rotate: 0, scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2" />
    <path d="M12 21v2" />
    <path d="M4.22 4.22l1.42 1.42" />
    <path d="M18.36 18.36l1.42 1.42" />
    <path d="M1 12h2" />
    <path d="M21 12h2" />
    <path d="M4.22 19.78l1.42-1.42" />
    <path d="M18.36 5.64l1.42-1.42" />
  </motion.svg>
);

const MoonIcon = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ rotate: -15, scale: 1 }}
    animate={{ rotate: 0, scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    <path d="M12 8a2 2 0 0 0 4 4 4 4 0 0 1-4 4 4 4 0 0 1 4-4" />
  </motion.svg>
);

const initialUsers: IUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Admin",
    department: "IT",
    location: "New York",
    joinDate: "2020-01-15",
    isActive: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "Editor",
    department: "Content",
    location: "Los Angeles",
    joinDate: "2021-03-20",
    isActive: true,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "Viewer",
    department: "Marketing",
    location: "Chicago",
    joinDate: "2019-11-05",
    isActive: false,
  },
  {
    id: 4,
    name: "Sara Williams",
    email: "sara@example.com",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "Editor",
    department: "Design",
    location: "Seattle",
    joinDate: "2022-05-10",
    isActive: true,
  },
  {
    id: 5,
    name: "Mike Brown",
    email: "mike@example.com",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    role: "Viewer",
    department: "Sales",
    location: "Boston",
    joinDate: "2021-08-15",
    isActive: false,
  },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg fixed top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8
        transition-all duration-300 hover:scale-110
        ${theme === "dark" 
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
          : "bg-gray-800 text-gray-100 hover:bg-gray-700"}
      `}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        key={theme}
        className="w-6 h-6 md:w-8 md:h-8"  // Responsive icon sizing
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </motion.div>
    </button>
  );
}
export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        <ThemeToggle />
        <main >
          
          <UserDashboard initialUsers={initialUsers} />
        </main>
      </div>
    </ThemeProvider>
  );
}
