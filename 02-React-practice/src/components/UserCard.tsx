"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { IUser } from "../app/types";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

interface UserCardProps {
  user: IUser;
  onViewProfile: (user: IUser) => void;
  onEditUser: (user: IUser) => void;
  onDeleteUser: (userId: number) => void;
}

const Icon = ({ className, path }: { className?: string; path: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const UserCard: React.FC<UserCardProps> = ({ user, onViewProfile, onEditUser, onDeleteUser }) => {
  const { theme } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`);
  };

  return (
    <motion.div 
      className={`relative border rounded-xl shadow-sm hover:shadow-md transition-all w-full max-w-[320px] 
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start gap-4 p-5">
        <div className="relative">
          {imageLoading && (
            <div className={`absolute inset-0 animate-pulse rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          )}
          <Image 
            src={avatarUrl}
            alt={user.name}
            width={80}
            height={80}
            className={`rounded-full w-20 h-20 object-cover border-2 shadow-sm ${theme === 'dark' ? 'border-gray-800' : 'border-white'}`}
            onError={handleImageError}
            onLoadingComplete={() => setImageLoading(false)}
            unoptimized
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'} ${user.isActive ? "bg-green-400" : "bg-red-400"}`} />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{user.name}</h2>
          <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-800'}`}>{user.role}</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? (theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800') : (theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')}`}>{user.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 border-t flex flex-wrap gap-2">
        <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`} onClick={() => onViewProfile(user)}>
          <Icon className="w-4 h-4" path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <span>View</span>
        </button>
        <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`} onClick={() => onEditUser(user)}>
          <Icon className="w-4 h-4" path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          <span>Edit</span>
        </button>
        <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`} onClick={() => onDeleteUser(user.id)}>
          <Icon className="w-4 h-4" path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
};

export default UserCard;
