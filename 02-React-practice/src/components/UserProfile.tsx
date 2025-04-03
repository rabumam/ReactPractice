"use client";
import Image from "next/image";
import { IUser } from "../app/types";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

interface UserProfileProps {
  user: IUser;
  onEdit: (user: IUser) => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit, onBack }) => {
  const { theme } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  const handleImageError = () => {
    setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`);
  };

  if (!user) return null;

  return (
    <motion.div 
      className={`border p-6 rounded-xl shadow-lg ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative">
          <Image 
            src={avatarUrl}
            alt={user.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            onError={handleImageError}
            unoptimized
          />
        </div>
        
        <div className="flex-1 space-y-3">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {user.name}
          </h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {user.email}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Role</span>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {user.role}
              </p>
            </div>
            
            <div>
              <span className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.isActive 
                  ? theme === 'dark' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-green-100 text-green-800'
                  : theme === 'dark' 
                    ? 'bg-red-900/30 text-red-400' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <span className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Department</span>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {user.department}
              </p>
            </div>

            <div>
              <span className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Location</span>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {user.location}
              </p>
            </div>

            <div className="col-span-2">
              <span className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Join Date</span>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => onEdit(user)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Edit Profile</span>
        </button>
        <button 
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Back to List
        </button>
      </div>
    </motion.div>
  );
};

export default UserProfile;