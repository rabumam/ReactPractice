"use client";
import React from "react";
import { ITodo } from "./TodoApp";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon, PauseIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface TodoItemProps {
  todo: ITodo;
  onEdit: (todo: ITodo) => void;
  onStatusUpdate: (todoId: number, status: ITodo["status"]) => void;
  onDelete: (todoId: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onStatusUpdate, onDelete }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const getPriorityColor = () => {
    switch (todo.priority) {
      case "High": return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "Medium": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      default: return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    }
  };

  const getStatusIcon = () => {
    switch (todo.status) {
      case "In Progress": return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case "Halted": return <PauseIcon className="w-5 h-5 text-orange-500" />;
      case "Completed": return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const isOverdue = new Date(todo.dueDate) < new Date() && todo.status !== "Completed";
  const canEditExisting = (user?.role === "Admin" && user.isActive) || user?.role === "Editor";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`group relative p-6 rounded-xl transition-all duration-300 border
        ${theme === "dark" ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
         : "bg-white border-gray-200 hover:border-gray-300"} 
        shadow-sm hover:shadow-md overflow-hidden`}
    >
      {isOverdue && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          Overdue
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {todo.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()}`}>
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {todo.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
            </div>
            
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{todo.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <select
          value={todo.status}
          onChange={(e) => onStatusUpdate(todo.id, e.target.value as ITodo["status"])}
          className={`text-sm px-3 py-1.5 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"}`}
        >
          <option value="To do">To do</option>
          <option value="In Progress">In Progress</option>
          <option value="Halted">Halted</option>
          <option value="Completed">Completed</option>
        </select>
        
        <div className="flex items-center gap-2">
          {canEditExisting && (
            <>
              <button
                onClick={() => onEdit(todo)}
                className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-500"}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;