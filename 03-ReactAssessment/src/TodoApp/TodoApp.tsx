"use client";
import React, { useState, useEffect } from "react";
import useLocalStorage from "../app/useLocalStorage";
import useFetch from "../app/useFetch";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { PlusIcon, ArrowPathIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export interface ITodo {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Completed" | "To do" | "In Progress" | "Halted";
  createdAt: string;
}

interface FetchedTodo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [todos, setTodos] = useLocalStorage<ITodo[]>("todos", []);
  const { data: fetchedTodos, loading, error, refetch } = useFetch<FetchedTodo[]>("https://jsonplaceholder.typicode.com/todos");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const [filter, setFilter] = useState<"all" | ITodo["status"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (fetchedTodos && fetchedTodos.length > 0 && todos.length === 0) {
      const initialTodos: ITodo[] = fetchedTodos.slice(0, 10).map((todo) => ({
        id: todo.id,
        title: todo.title,
        description: `Sample description for ${todo.title}`,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        category: ["Work", "Personal", "Shopping", "Health"][Math.floor(Math.random() * 4)],
        priority: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
        status: todo.completed ? "Completed" : ["Tod do", "In Progress", "Halted"][Math.floor(Math.random() * 3)] as ITodo["status"],
        createdAt: new Date().toISOString(),
      }));
      setTodos(initialTodos);
    }
  }, [fetchedTodos, todos.length, setTodos]);

  const handleAdd = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleEdit = (todo: ITodo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleFormSubmit = (todoData: Partial<ITodo>) => {
    if (editingTodo) {
      const updatedTodos = todos.map((t) =>
        t.id === editingTodo.id ? { ...t, ...todoData } : t
      );
      setTodos(updatedTodos);
    } else {
      const newTodo: ITodo = {
        id: Date.now(),
        title: todoData.title || "",
        description: todoData.description || "",
        dueDate: todoData.dueDate || new Date().toISOString().slice(0, 10),
        category: todoData.category || "General",
        priority: (todoData.priority as "Low" | "Medium" | "High") || "Medium",
        status: "Tod do",
        createdAt: new Date().toISOString(),
      };
      setTodos([newTodo, ...todos]);
    }
    setShowForm(false);
  };

  const handleStatusUpdate = (todoId: number, status: ITodo["status"]) => {
    const updatedTodos = todos.map((t) =>
      t.id === todoId ? { ...t, status } : t
    );
    setTodos(updatedTodos);
  };

  const handleDelete = (todoId: number) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === "all" || todo.status === filter;
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         todo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.status === "Completed").length,
    inProgress: todos.filter(t => t.status === "In Progress").length,
    overdue: todos.filter(t => new Date(t.dueDate) < new Date() && t.status !== "Completed").length,
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className={`mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {user?.role === "Admin" && user.isActive && (
              <button 
                onClick={handleAdd}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add Task
              </button>
            )}
            
            <button 
              onClick={() => refetch()}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            theme={theme}
            title="Total Tasks"
            value={stats.total}
            icon="📋"
            color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard 
            theme={theme}
            title="Completed"
            value={stats.completed}
            icon="✅"
            color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          />
          <StatCard 
            theme={theme}
            title="In Progress"
            value={stats.inProgress}
            icon="🚧"
            color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
          />
          <StatCard 
            theme={theme}
            title="Overdue"
            value={stats.overdue}
            icon="⏰"
            color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"}`}
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | ITodo["status"])}
              className={`px-4 py-2.5 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
            >
              <option value="all">All Tasks</option>
              <option value="Tod do">Tod do</option>
              <option value="In Progress">In Progress</option>
              <option value="Halted">Halted</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className={`p-4 rounded-lg mb-6 ${theme === "dark" ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-600"}`}>
            Error: {error.message}
          </div>
        )}

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mb-8"
            >
              <TodoForm
                initialData={editingTodo || undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TodoList 
                todos={filteredTodos} 
                onEdit={handleEdit} 
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard = ({ theme, title, value, icon, color }: { theme: string, title: string, value: number, icon: string, color: string }) => (
  <div className={`p-4 rounded-xl border ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} text-2xl`}>
        {icon}
      </div>
    </div>
  </div>
);

export default TodoApp;