"use client";
import { MoonIcon, SunIcon, ListBulletIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { AuthProvider, useAuth } from "../Context/AuthContext";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";
import UserDashboard from "../Components/UserDashboard";
import LoginPage from "./LoginPage";
import TodoApp from "../TodoApp/TodoApp";
import { IUser } from "./types";
import { useState } from "react";

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

function Header({
  onToggleTodo,
  todoButtonLabel,
  showTodoButton,
}: {
  onToggleTodo: () => void;
  todoButtonLabel: string;
  showTodoButton: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="absolute top-4 right-4 flex gap-3 items-center z-50">
  {/* Todo Toggle Button */}
  {showTodoButton && (
    <motion.button
      onClick={onToggleTodo}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all
        ${theme === "dark" 
          ? "bg-gray-800 border-emerald-500 hover:bg-emerald-900/30 text-emerald-400 hover:text-emerald-300" 
          : "bg-white border-emerald-400 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700"}
      `}
    >
      <ListBulletIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="hidden sm:inline-block font-medium">{todoButtonLabel}</span>
      <motion.span 
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        className="absolute bottom-0 left-0 h-0.5 bg-emerald-400"
      />
    </motion.button>
  )}

  {/* Logout Button */}
  {user && (
    <motion.button
      onClick={logout}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all
        ${theme === "dark" 
          ? "bg-gray-800 border-rose-500 hover:bg-rose-900/30 text-rose-400 hover:text-rose-300" 
          : "bg-white border-rose-400 hover:bg-rose-50 text-rose-600 hover:text-rose-700"}
      `}
    >
      <ArrowLeftOnRectangleIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="hidden sm:inline-block font-medium">Logout</span>
      <motion.span 
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        className="absolute bottom-0 left-0 h-0.5 bg-rose-400"
      />
    </motion.button>
  )}

  {/* Theme Toggle Button (Enhanced but matching) */}
  <motion.button
    onClick={toggleTheme}
    whileHover={{ rotate: theme === "dark" ? 15 : -15, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className={`group relative p-2.5 rounded-xl border-2 transition-all
      ${theme === "dark" 
        ? "bg-gray-800 border-amber-400 hover:bg-amber-900/30" 
        : "bg-white border-indigo-400 hover:bg-indigo-50"}
    `}
    aria-label="Toggle theme"
  >
    <motion.div
      key={theme}
      animate={{ 
        rotate: theme === "dark" ? [0, 360] : [360, 0],
        transition: { duration: 0.7 }
      }}
      className="w-6 h-6 md:w-7 md:h-7"
    >
      {theme === "dark" ? (
        <SunIcon className="text-amber-400 group-hover:text-amber-300" />
      ) : (
        <MoonIcon className="text-black group-hover:white" />
      )}
    </motion.div>
    <motion.span 
      initial={{ width: 0 }}
      whileHover={{ width: "100%" }}
      className={`absolute bottom-0 left-0 h-0.5 ${theme === "dark" ? "bg-amber-400" : "bg-indigo-400"}`}
    />
  </motion.button>
</header>
  );
}

function MainContent() {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const { user } = useAuth();
  const [showTodo, setShowTodo] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  
  const todoButtonLabel = showTodo ? " Dashboard" : "To Do List";
  // Hide the Todo button on the login screen and when the Add User Form is visible
  const showTodoButton = !!user && !showUserForm;

  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        <Header 
          onToggleTodo={() => setShowTodo((prev) => !prev)}
          todoButtonLabel={todoButtonLabel}
          showTodoButton={showTodoButton}
        />
        <div className="pt-20">
          {!user ? (
            <LoginPage users={users} />
          ) : showTodo ? (
            <main className="p-8">
              <TodoApp />
            </main>
          ) : (
            <main className="top-8">
              <UserDashboard 
                users={users} 
                onUsersChange={setUsers} 
                onFormVisibilityChange={setShowUserForm}
              />
            </main>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
