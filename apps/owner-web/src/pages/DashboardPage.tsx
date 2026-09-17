import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Wrench, Inbox, CheckCircle, IndianRupee, Plus, ArrowRight, Clock } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiRequest<any>('/owners/dashboard');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
        <p className="mt-2 text-sm text-slate-500">Loading owner dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Equipment Provider Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Owner Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Manage machinery rentals, track revenue, and respond to farmer requests.</p>
          </div>

          <Link
            to="/my-equipment"
            className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center space-x-2 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Machinery Listing</span>
          </Link>
        </div>

        {/* Analytics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Machinery</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.equipmentCount || 0}</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">{stats?.activeEquipmentCount || 0} active & listed</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-800">
              <Wrench className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{stats?.pendingBookings || 0}</h3>
              <p className="text-xs text-amber-700 font-medium mt-1">Requires your confirmation</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-800">
              <Clock className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed Rentals</span>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{stats?.confirmedBookings || 0}</h3>
              <p className="text-xs text-emerald-700 font-medium mt-1">Scheduled rentals</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-800">
              <CheckCircle className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{(stats?.totalEarnings || 0).toLocaleString('en-IN')}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">From confirmed bookings</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-800">
              <IndianRupee className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Quick Actions & Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/booking-requests"
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group flex justify-between items-center"
          >
            <div>
              <div className="bg-amber-100 p-3 rounded-xl w-fit text-amber-800 mb-4">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition">
                Incoming Booking Requests
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                View farmer requests, selected rental dates, and accept or reject bookings.
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-1 transition shrink-0 ml-4" />
          </Link>

          <Link
            to="/my-equipment"
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group flex justify-between items-center"
          >
            <div>
              <div className="bg-slate-100 p-3 rounded-xl w-fit text-slate-800 mb-4">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition">
                Manage Owned Machinery
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add new machinery, set daily rates, update locations, and toggle availability.
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-1 transition shrink-0 ml-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
