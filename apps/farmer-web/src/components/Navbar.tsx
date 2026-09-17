import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, Calendar, User as UserIcon, LogOut, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-emerald-700 p-2 rounded-lg group-hover:bg-emerald-600 transition">
            <Tractor className="h-6 w-6 text-emerald-200" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block leading-none">AgriRental</span>
            <span className="text-xs text-emerald-300 font-medium">Farmer Portal</span>
          </div>
        </Link>

        {user ? (
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') ? 'bg-emerald-900 text-white' : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Explore</span>
            </Link>

            <Link
              to="/my-bookings"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/my-bookings') ? 'bg-emerald-900 text-white' : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>My Bookings</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/profile') ? 'bg-emerald-900 text-white' : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>{user.name.split(' ')[0]}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-emerald-200 hover:bg-red-700 hover:text-white transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-emerald-100 hover:text-white px-3 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow transition"
            >
              Register Farmer
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
