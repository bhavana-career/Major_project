import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Phone, MapPin } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await apiRequest<any[]>('/bookings/farmer');
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Owner Confirmation</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Confirmed Booking</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <XCircle className="h-3.5 w-3.5 text-red-600" />
            <span>Request Rejected</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Rental Bookings</h1>
          <p className="text-xs text-slate-500">Track equipment rental requests and confirmation status</p>
        </div>

        {/* Tab Filters */}
        <div className="flex space-x-2 border-b border-slate-200 mb-6 pb-2">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === tab
                  ? 'bg-emerald-700 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Fetching your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 mt-1">You don't have any bookings matching this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={b.equipment.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800&q=80'}
                    alt={b.equipment.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 bg-slate-100"
                  />

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-semibold text-slate-400">#{b.bookingNumber}</span>
                      {getStatusBadge(b.status)}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">{b.equipment.title}</h3>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <p className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          <strong>Dates:</strong> {new Date(b.startDate).toLocaleDateString('en-IN')} to{' '}
                          {new Date(b.endDate).toLocaleDateString('en-IN')} ({b.totalDays} days)
                        </span>
                      </p>
                      <p className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span><strong>Location:</strong> {b.equipment.locationName}</span>
                      </p>
                      {b.equipment.ownerProfile?.user && (
                        <p className="flex items-center space-x-1 text-emerald-800 font-medium">
                          <Phone className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            <strong>Owner Contact:</strong> {b.equipment.ownerProfile.user.name} ({b.equipment.ownerProfile.user.phone})
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:text-right flex md:flex-col justify-between items-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Rental Price</span>
                    <span className="text-xl font-extrabold text-emerald-700">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 block mt-2">
                    Requested on {new Date(b.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
