"use client";
import React from "react";
import { ITodo } from "./TodoApp";
import TodoItem from "./TodoItem";
import {  AnimatePresence } from "framer-motion";

interface TodoListProps {
  todos: ITodo[];
  onEdit: (todo: ITodo) => void;
  onStatusUpdate: (todoId: number, status: ITodo["status"]) => void;
  onDelete: (todoId: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onEdit, onStatusUpdate, onDelete }) => {
  const sortedTodos = [...todos].sort((a, b) => {
    // Sort by status (Completed last)
    if (a.status === "Completed" && b.status !== "Completed") return 1;
    if (b.status === "Completed" && a.status !== "Completed") return -1;
    
    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {sortedTodos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onEdit={onEdit} 
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TodoList;