"use client";
import { useTheme } from "../context/ThemeContext";

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } p-6 rounded-xl max-w-md w-full space-y-4`}>
        <p className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
          {message}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-red-600 hover:bg-red-500 text-gray-100"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;