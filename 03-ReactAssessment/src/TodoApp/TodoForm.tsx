"use client";
import React from "react";
import useForm from "../app/useForm";
import { ITodo } from "./TodoApp";
import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TodoFormValues {
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: "Low" | "Medium" | "High";
}

interface TodoFormProps {
  initialData?: Partial<ITodo>;
  onSubmit: (data: Partial<ITodo>) => void;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const validate = (values: TodoFormValues): Partial<TodoFormValues> => {
    const errors: Partial<TodoFormValues> = {};
    if (!values.title) errors.title = "Title is required";
    if (!values.dueDate) errors.dueDate = "Due date is required";
    return errors;
  };

  const { values, errors, touched, handleChange, handleSubmit } =
    useForm<TodoFormValues>(
      {
        title: initialData?.title || "",
        description: initialData?.description || "",
        dueDate: initialData?.dueDate || new Date().toISOString().slice(0, 10),
        category: initialData?.category || "General",
        priority: (initialData?.priority as "Low" | "Medium" | "High") || "Medium",
      },
      validate
    );

  const inputClass = `block w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
    theme === "dark"
      ? "bg-gray-800 border-gray-700 focus:border-indigo-500 focus:ring-indigo-900/30 text-white placeholder-gray-400"
      : "bg-white border-gray-300 focus:border-indigo-400 focus:ring-indigo-200 text-gray-900 placeholder-gray-500"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border shadow-lg overflow-hidden ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className={`p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {initialData ? "Edit Task" : "Create New Task"}
          </h3>
          <button
            onClick={onCancel}
            className={`p-1 rounded-full ${theme === "dark" ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="p-6 space-y-5">
        <div>
          <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter task title"
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Description
          </label>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            className={inputClass}
            rows={3}
            placeholder="Enter task description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={values.dueDate}
              onChange={handleChange}
              className={inputClass}
            />
            {touched.dueDate && errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Category
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`block mb-2 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Priority
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["Low", "Medium", "High"] as const).map((priority) => (
              <label
                key={priority}
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  values.priority === priority
                    ? theme === "dark"
                      ? "bg-indigo-900/30 border-indigo-700 text-indigo-400"
                      : "bg-indigo-100 border-indigo-300 text-indigo-700"
                    : theme === "dark"
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={values.priority === priority}
                  onChange={handleChange}
                  className="hidden"
                />
                {priority}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-2.5 rounded-lg border transition-colors ${
              theme === "dark"
                ? "border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {initialData ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TodoForm;