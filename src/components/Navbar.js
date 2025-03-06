import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiEdit,
  FiUser,
} from "react-icons/fi";

export const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="mainlogo.png" alt="Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Right side - Navigation links */}
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                {/* Home Link */}
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-lg font-medium flex items-center space-x-2 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                    }`
                  }
                >
                  <FiHome className="text-xl" />
                  <span className="hidden sm:block">Home</span>
                </NavLink>

                {/* Profile Link */}
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `text-lg font-medium flex items-center space-x-2 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                    }`
                  }
                >
                  <FiUser className="text-xl" />
                  <span className="hidden sm:block">Profile</span>
                </NavLink>
              </>
            ) : (
              <>
                {/* Login Link */}
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 text-lg font-medium ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                    }`
                  }
                >
                  <FiLogIn className="text-xl" />
                  <span className="hidden sm:block">Login</span>
                </NavLink>

                {/* Signup Link */}
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 text-lg font-medium ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                    }`
                  }
                >
                  <FiUserPlus className="text-xl" />
                  <span className="hidden sm:block">Sign Up</span>
                </NavLink>
              </>
            )}

            {currentUser && (
              // Logout Button
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
              >
                <FiLogOut className="text-xl" />
                <span className="hidden sm:block">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
