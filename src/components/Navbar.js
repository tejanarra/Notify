import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-30 w-full transition-all duration-300 backdrop-blur-md shadow-sm bg-transparent`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/mainlogo.png" alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            {currentUser ? (
              <>
                <NavLink
                  to="/notes"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-800"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                    }`
                  }
                >
                  <FiHome className="text-lg" />
                  <span>Dashboard</span>
                </NavLink>

                <div className="border-l h-5 border-slate-200 mx-1"></div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-800"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                    }`
                  }
                >
                  <FiLogIn className="text-lg" />
                  <span>Sign In</span>
                </NavLink>

                <NavLink
                  to="/signup"
                  className="flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-colors shadow-sm hover:shadow"
                >
                  <FiUserPlus className="text-lg" />
                  <span>Sign Up</span>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1.5 rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-800 focus:outline-none"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white border-t border-slate-100 shadow-md`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {currentUser ? (
            <>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                  }`
                }
              >
                <FiHome className="text-xl" />
                <span>Dashboard</span>
              </NavLink>

              <div className="border-t border-slate-100 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
              >
                <FiLogOut className="text-xl" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                  }`
                }
              >
                <FiLogIn className="text-xl" />
                <span>Sign In</span>
              </NavLink>

              <NavLink
                to="/signup"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
              >
                <FiUserPlus className="text-xl" />
                <span>Sign Up</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
