"use client";
import { useState, FormEvent } from "react";
import { IUser } from "../app/types";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface UserFormProps {
  initialData?: Partial<IUser>;
  onSubmit: (data: Partial<IUser>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState<"Admin" | "Editor" | "Viewer">(
    initialData?.role as "Admin" | "Editor" | "Viewer" || "Viewer"
  );
  const [isActive, setIsActive] = useState(initialData?.isActive || false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, role, isActive });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 p-6 rounded-xl shadow-lg ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}
    >
      <h2 className={`text-2xl font-bold ${
        theme === "dark" ? "text-gray-100" : "text-gray-800"
      }`}>
        {initialData ? "Edit User" : "Add User"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full rounded-md ${
              theme === "dark" 
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 text-gray-800"
            } shadow-sm focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full rounded-md ${
              theme === "dark" 
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 text-gray-800"
            } shadow-sm focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "Admin" | "Editor" | "Viewer")}
            className={`mt-1 block w-full rounded-md ${
              theme === "dark" 
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 text-gray-800"
            } shadow-sm focus:ring-2 focus:ring-blue-500`}
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className={`h-4 w-4 rounded ${
              theme === "dark" 
                ? "bg-gray-600 border-gray-500 text-blue-500"
                : "border-gray-300 text-blue-600"
            } focus:ring-blue-500`}
          />
          <label className={`ml-2 block text-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-500 text-gray-100"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {initialData ? "Update User" : "Create User"}
        </button>
      </div>
    </motion.form>
  );
};

export default UserForm;