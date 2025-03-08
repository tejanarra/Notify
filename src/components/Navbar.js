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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-30 w-full transition-all duration-300 backdrop-blur-md ${
        scrolled ? "bg-black/80 shadow-lg shadow-pink-500/10" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600">
                Notify
              </h2>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            {currentUser ? (
              <>
                <NavLink
                  to="/notes"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        : "text-gray-300 hover:bg-pink-500/10 hover:text-pink-400"
                    }`
                  }
                >
                  <FiHome className="text-lg" />
                  <span>Dashboard</span>
                </NavLink>

                <div className="border-l h-5 border-pink-500/20 mx-1"></div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black"></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-300 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
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
                        ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        : "text-gray-300 border border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-400"
                    }`
                  }
                >
                  <FiLogIn className="text-lg" />
                  <span>Log in</span>
                </NavLink>

                <NavLink
                  to="/signup"
                  className="flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 transition-colors shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40"
                >
                  <FiUserPlus className="text-lg" />
                  <span>Sign Up</span>
                </NavLink>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1.5 rounded-full text-pink-400 hover:bg-pink-500/10 focus:outline-none"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-gray-900 border-t border-pink-500/20 shadow-lg shadow-pink-500/10`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {currentUser ? (
            <>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                      : "text-gray-300 hover:bg-pink-500/10 hover:text-pink-400"
                  }`
                }
              >
                <FiHome className="text-xl" />
                <span>Dashboard</span>
              </NavLink>

              <div className="border-t border-pink-500/20 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:bg-pink-500/10 hover:text-pink-400"
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
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                      : "text-gray-300 hover:bg-pink-500/10 hover:text-pink-400"
                  }`
                }
              >
                <FiLogIn className="text-xl" />
                <span>Log in</span>
              </NavLink>

              <NavLink
                to="/signup"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700"
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
