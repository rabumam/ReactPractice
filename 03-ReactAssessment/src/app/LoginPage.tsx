"use client";
import useForm from "./useForm";
import { IUser } from "./types";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";
import { FiMail, FiLock,  FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

interface LoginPageProps {
  users: IUser[];
}

const LoginPage: React.FC<LoginPageProps> = ({ users }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [submissionError, setSubmissionError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = (values: { email: string; password: string }) => {
    const errors: { email?: string; password?: string } = {};
    if (!values.email) errors.email = "Required";
    if (!values.password) errors.password = "Required";
    return errors;
  };

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } = useForm(
    { email: "", password: "" },
    validate
  );

  const submitHandler = async (vals: { email: string; password: string }) => {
    setSubmissionError("");
    try {
      const user = users.find((u) => u.email === vals.email);
      
      if (!user) {
        setSubmissionError("Account not found");
        return;
      }
      
      if (!user.isActive) {
        setSubmissionError("Account is inactive");
        return;
      }

      if (vals.password !== "12345") {
        setSubmissionError("Invalid password");
        return;
      }

      await login(user);
    } catch {
      setSubmissionError("An error occurred. Please try again.");
    }
  };

  const containerClasses = `min-h-screen flex items-center justify-center p-4 
    ${theme === "dark" ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-gray-100"}`;

  const formClasses = `p-8 rounded-xl shadow-xl space-y-6 w-full max-w-md relative overflow-hidden
    ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
    before:absolute before:inset-0 before:bg-gradient-to-r ${theme === "dark" ? 
    "before:from-blue-900 before:to-purple-900" : "before:from-blue-400 before:to-purple-400"} 
    before:opacity-10`;

  const inputClasses = `w-full px-4 py-3 rounded-lg border transition-all
    ${theme === "dark" ? 
      "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400" : 
      "bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}
    ${errors.email || errors.password ? "border-red-500" : ""}`;

  return (
    <div className={containerClasses}>
      <motion.form 
        onSubmit={(e) => handleSubmit(e, submitHandler)}
        className={formClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
        
        </div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <div className="relative">
              <FiMail className={`absolute left-3 top-3.5 ${theme === "dark" ? 
                "text-gray-400" : "text-gray-500"}`} />
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={values.email}
                onChange={handleChange}
                className={`${inputClasses} pl-10`}
              />
              {touched.email && errors.email && (
                <span className="text-sm text-red-400 mt-1 block">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <FiLock className={`absolute left-3 top-3.5 ${theme === "dark" ? 
                "text-gray-400" : "text-gray-500"}`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                className={`${inputClasses} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-500"
              >
                {showPassword ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
              </button>
              {touched.password && errors.password && (
                <span className="text-sm text-red-400 mt-1 block">{errors.password}</span>
              )}
            </div>
          </div>

          {submissionError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-red-400 text-sm"
            >
              <FiAlertCircle className="flex-shrink-0" />
              {submissionError}
            </motion.div>
          )}

          <div className="flex justify-center">
            <motion.button
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-full font-medium transition-all
                ${isSubmitting ? 
                  "bg-blue-400 cursor-not-allowed" : 
                  "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"}
                text-white shadow-lg relative overflow-hidden`}
            >
              {isSubmitting && (
                <motion.span
                  className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
              <span className="flex items-center gap-2">
                {isSubmitting && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="block w-4 h-4 border-2 border-white rounded-full border-t-transparent"
                  />
                )}
                {isSubmitting ? "Signing In..." : "Sign In"}
              </span>
            </motion.button>
          </div>

          <p className={`mt-4 text-center text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Use password <code className="mx-1 px-2 py-1 rounded bg-opacity-20 bg-blue-500">12345</code>
            for any active account
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default LoginPage;