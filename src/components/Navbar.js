// components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiLogIn, FiUserPlus, FiLogOut, FiEdit } from 'react-icons/fi';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Brand and main nav */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <FiEdit className="text-blue-600 text-xl" />
              <span className="text-xl font-bold text-gray-800">Notify</span>
            </Link>
            
            {currentUser && (
              <div className="hidden md:flex items-center space-x-4">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `flex items-center space-x-1 ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
                  }
                >
                  <FiHome className="inline-block" />
                  <span>Home</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Right side - Auth-related navigation */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden md:block">
                  {currentUser.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
                >
                  <FiLogOut className="inline-block" />
                  <span className="hidden md:block">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `flex items-center space-x-1 ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
                  }
                >
                  <FiLogIn className="inline-block" />
                  <span>Login</span>
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className={({ isActive }) => 
                    `flex items-center space-x-1 ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`
                  }
                >
                  <FiUserPlus className="inline-block" />
                  <span>Sign Up</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};