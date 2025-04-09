"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserCard from "./UserCard";
import { IUser } from "../app/types";

interface UserListProps {
  users: IUser[];
  onViewProfile: (user: IUser) => void;
  onEditUser: (user: IUser) => void;
  onDeleteUser: (userId: number) => void;
  viewMode: "card" | "list";
}

const UserList: React.FC<UserListProps> = ({ users, onViewProfile, onEditUser, onDeleteUser, viewMode }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm);

    let matchesFilter = true;
    if (filter === "active") {
      matchesFilter = user.isActive;
    } else if (filter === "inactive") {
      matchesFilter = !user.isActive;
    }
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "active" | "inactive")}
          className="border p-2 rounded"
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="inactive">Inactive Users</option>
        </select>
      </div>
      {viewMode === "card" ? (
        filteredUsers.length > 0 ? (
            <motion.div layout className="flex flex-wrap gap-4">
            <AnimatePresence>
              {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onViewProfile={onViewProfile}
                onEditUser={onEditUser}
                onDeleteUser={onDeleteUser}
                // className="flex-1 min-w-[250px] max-w-[300px]"
              />
              ))}
            </AnimatePresence>
            </motion.div>
        ) : (
          <p>No users found</p>
        )
      ) : (
        filteredUsers.length > 0 ? (
           <motion.table layout className="w-full border" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <thead>
              <tr className={`border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <td className={`p-2 ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>{user.name}</td>
                  <td className={`p-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{user.email}</td>
                  <td className={`p-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{user.role}</td>
                  <td className={`p-2 ${user.isActive ? "text-green-500" : "text-red-500"}`}>{user.isActive ? "Active" : "Inactive"}</td>
                  <td className="p-2 flex gap-2">
                    <button className="text-blue-500" onClick={() => onViewProfile(user)}>View</button>
                    <button className="text-gray-500" onClick={() => onEditUser(user)}>Edit</button>
                    <button className="text-red-500" onClick={() => onDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <p>No users found</p>
        )
      )}
    </div>
  );
};

export default UserList;
