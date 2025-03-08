import React from "react";

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
}) => {
  if (!isOpen) return null;
  let gradientClasses = "from-pink-500 to-fuchsia-600";
  let borderClasses = "border-pink-500/30";
  let shadowClasses = "shadow-pink-500/30";
  let hoverShadowClasses = "shadow-pink-500/50";
  let buttonGradient =
    "from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700";

  if (type === "delete") {
    gradientClasses = "from-red-500 to-pink-600";
    borderClasses = "border-red-500/30";
    shadowClasses = "shadow-red-500/30";
    hoverShadowClasses = "shadow-red-500/50";
    buttonGradient =
      "from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700";
  } else if (type === "logout") {
    gradientClasses = "from-blue-500 to-violet-600";
    borderClasses = "border-blue-500/30";
    shadowClasses = "shadow-blue-500/30";
    hoverShadowClasses = "shadow-blue-500/50";
    buttonGradient =
      "from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700";
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity"></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-gray-900 rounded-2xl border border-opacity-20 max-w-md w-full p-6 overflow-hidden shadow-2xl transform transition-all">
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r ${gradientClasses} opacity-20 blur-sm rounded-2xl`}
          ></div>
          <div
            className={`absolute inset-0 bg-gray-900 rounded-2xl border ${borderClasses}`}
          ></div>

          <div className="relative z-10">
            <div className="text-center mb-5">
              <h3
                className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradientClasses}`}
              >
                {title}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-center">{message}</p>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={onClose}
                className={`px-5 py-2 rounded-full border ${borderClasses} text-gray-300 hover:bg-gray-800 transition-all duration-200`}
              >
                {cancelText}
              </button>

              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-5 py-2 rounded-full bg-gradient-to-r ${buttonGradient} text-white shadow-lg ${shadowClasses} hover:shadow-xl ${hoverShadowClasses} transition-all duration-200`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
