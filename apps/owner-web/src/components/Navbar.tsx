import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, LayoutDashboard, Wrench, Inbox, User as UserIcon, LogOut } from 'lucide-react';

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
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-amber-600 p-2 rounded-lg group-hover:bg-amber-500 transition">
            <Tractor className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block leading-none">AgriRental</span>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Owner Portal</span>
          </div>
        </Link>

        {user ? (
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/my-equipment"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/my-equipment') ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Wrench className="h-4 w-4" />
              <span>My Equipment</span>
            </Link>

            <Link
              to="/booking-requests"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/booking-requests') ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Inbox className="h-4 w-4" />
              <span>Booking Requests</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/profile') ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>{user.name.split(' ')[0]}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-red-700 hover:text-white transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow transition"
            >
              Register Owner
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
