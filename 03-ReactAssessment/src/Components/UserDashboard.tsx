"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import UserForm from "./UserForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { IUser } from "../app/types";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../app/useFetch";
import { ArrowPathIcon, Squares2X2Icon, ListBulletIcon, PlusIcon, HomeIcon } from "@heroicons/react/24/outline";

interface FetchedUser {
  id: number;
  name: string;
  email: string;
  address?: {
    street: string;
    city: string;
  };
  company?: {
    name: string;
  };
}

interface UserDashboardProps {
  users: IUser[];
  onUsersChange: (users: IUser[]) => void;
  onFormVisibilityChange: (visible: boolean) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  users,
  onUsersChange,
  onFormVisibilityChange,
}) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    userId: number | null;
  }>({
    show: false,
    userId: null,
  });
  const [usingFetchedData, setUsingFetchedData] = useState(false);
  const {
    data: fetchedUsers,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useFetch<FetchedUser[]>("https://jsonplaceholder.typicode.com/users");
  const isMainPage = !showForm && !selectedUser;

  useEffect(() => {
    onFormVisibilityChange(showForm);
  }, [showForm, onFormVisibilityChange]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "card" ? "list" : "card"));
  };

  const handleViewProfile = (user: IUser) => {
    setSelectedUser(user);
    setShowForm(false);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: Partial<IUser>) => {
    if (editingUser) {
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      );
      onUsersChange(updatedUsers);
      setSelectedUser({ ...editingUser, ...formData });
    } else {
      const newUser: IUser = {
        id: Date.now(),
        name: formData.name || "",
        email: formData.email || "",
        role: (formData.role as "Admin" | "Editor" | "Viewer") || "Viewer",
        isActive: formData.isActive || false,
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        department: "New",
        location: "Unknown",
        joinDate: new Date().toISOString().slice(0, 10),
      };
      onUsersChange([...users, newUser]);
    }
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleDeleteUser = (userId: number) => {
    setConfirmDelete({ show: true, userId });
  };

  const confirmDeleteUser = () => {
    if (confirmDelete.userId !== null) {
      if (!usingFetchedData) {
        onUsersChange(users.filter((user) => user.id !== confirmDelete.userId));
      }
      if (selectedUser && selectedUser.id === confirmDelete.userId) {
        setSelectedUser(null);
      }
    }
    setConfirmDelete({ show: false, userId: null });
  };

  const cancelDeleteUser = () => {
    setConfirmDelete({ show: false, userId: null });
  };

  const handleRefresh = () => {
    setUsingFetchedData(true);
    refetch();
  };

  const handleBackToOriginal = () => {
    setUsingFetchedData(false);
  };

  return (
    <div className="p-2 md:p-8 space-y-6 max-w-7xl mx-auto">
      {!showForm && (
        <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-3xl font-bold">
            👥 User Management
          </h1>
          {isMainPage && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={toggleViewMode}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {viewMode === "card" ? (
                  <>
                    <ListBulletIcon className="w-5 h-5" />
                    List View
                  </>
                ) : (
                  <>
                    <Squares2X2Icon className="w-5 h-5" />
                    Card View
                  </>
                )}
              </button>
              <button
                onClick={handleAddUser}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add New User
              </button>
              
              {!usingFetchedData && (
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors"
                  disabled={fetchLoading}
                >
                  <ArrowPathIcon className={`w-5 h-5 ${fetchLoading ? 'animate-spin' : ''}`} />
                  {fetchLoading ? "Loading..." : "Load Demo Users"}
                </button>
              )}
              {usingFetchedData && (
                <>
                  <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors"
                    disabled={fetchLoading}
                  >
                    <ArrowPathIcon className={`w-5 h-5 ${fetchLoading ? 'animate-spin' : ''}`} />
                    {fetchLoading ? "Refreshing..." : "Refresh Demo"}
                  </button>
                  <button
                    onClick={handleBackToOriginal}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <HomeIcon className="w-5 h-5" />
                    App Users
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div 
            key="form" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <UserForm
              initialData={editingUser || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </motion.div>
        ) : selectedUser ? (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <UserProfile
              user={selectedUser}
              onEdit={handleEditUser}
              onBack={() => setSelectedUser(null)}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="list" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            {usingFetchedData ? (
              <>
                {fetchLoading && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ArrowPathIcon className="w-12 h-12 mx-auto animate-spin" />
                    <p className="mt-4">Loading demo users...</p>
                  </div>
                )}
                {fetchError && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg">
                    Error: {fetchError.message}
                  </div>
                )}
                {!fetchLoading && !fetchError && fetchedUsers && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {fetchedUsers.map((user) => {
                      const avatarUrl = `https://randomuser.me/api/portraits/${user.id % 2 === 0 ? 'women' : 'men'}/${user.id % 50}.jpg`;
                      
                      return (
                        <div
                          key={user.id}
                          className="group relative p-6 rounded-xl transition-all duration-300 
                                    bg-white dark:bg-gray-800 
                                    border border-gray-200 dark:border-gray-700 
                                    shadow-sm hover:shadow-lg
                                    hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500
                                    overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-indigo-50 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                          
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <Image
                                  src={avatarUrl}
                                  alt={user.name}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                  onError={() => {
                                    const fallbackElement = document.createElement('div');
                                    fallbackElement.className = "w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium border-2 border-white dark:border-gray-700";
                                    fallbackElement.textContent = user.name.charAt(0).toUpperCase();
                                    const parent = document.querySelector(`[src="${avatarUrl}"]`)?.parentElement;
                                    if (parent) {
                                      parent.innerHTML = '';
                                      parent.appendChild(fallbackElement);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                                {user.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 mt-1 truncate">
                                {user.email}
                              </p>
                              
                              <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  {user.company?.name || 'Member'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            onClick={() => handleViewProfile({
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              role: 'Viewer',
                              isActive: true,
                              avatar: avatarUrl,
                              department: user.company?.name || 'Unknown',
                              location: `${user.address?.city || 'Unknown'}, ${user.address?.street || ''}`,
                              joinDate: new Date().toISOString().slice(0, 10)
                            })}
                          >
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <UserList
                users={users}
                viewMode={viewMode}
                onViewProfile={handleViewProfile}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {confirmDelete.show && (
        <ConfirmationDialog
          message="Are you sure you want to delete this user?"
          
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
};

export default UserDashboard;