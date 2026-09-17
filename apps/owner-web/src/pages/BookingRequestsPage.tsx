import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Clock, CheckCircle2, XCircle, Calendar, User as UserIcon, Phone, MapPin, AlertCircle } from 'lucide-react';

export const BookingRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'CONFIRMED' | 'ALL'>('PENDING');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const fetchOwnerRequests = async () => {
    try {
      const data = await apiRequest<any[]>('/bookings/owner');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerRequests();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: 'CONFIRMED' | 'REJECTED') => {
    setActionError('');
    setUpdatingId(bookingId);
    try {
      await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOwnerRequests();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (activeTab === 'ALL') return true;
    return r.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Action Required</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Confirmed</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <XCircle className="h-3.5 w-3.5 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Farmer Booking Requests</h1>
          <p className="text-xs text-slate-500">Review incoming machinery requests from farmers and manage approvals</p>
        </div>

        {actionError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Tab Filter */}
        <div className="flex space-x-2 border-b border-slate-200 mb-6 pb-2">
          {(['PENDING', 'CONFIRMED', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === tab
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab === 'PENDING' ? 'Pending Action' : tab === 'CONFIRMED' ? 'Confirmed Rentals' : 'All History'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Loading incoming requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
            <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Booking Requests</h3>
            <p className="text-xs text-slate-500 mt-1">There are no booking requests under this status tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow transition flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-400">#{req.bookingNumber}</span>
                    {getStatusBadge(req.status)}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{req.equipment.title}</h3>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold">
                      <UserIcon className="h-4 w-4 text-amber-600" />
                      <span>Farmer: {req.farmer.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>Contact Phone: {req.farmer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        Dates: {new Date(req.startDate).toLocaleDateString('en-IN')} to{' '}
                        {new Date(req.endDate).toLocaleDateString('en-IN')} ({req.totalDays} day rental)
                      </span>
                    </div>
                    {req.notes && (
                      <p className="text-slate-500 italic mt-1 border-t border-slate-200 pt-1">
                        "Notes: {req.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Rental Value</span>
                    <span className="text-2xl font-extrabold text-amber-700">₹{req.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Requested {new Date(req.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleStatusChange(req.id, 'REJECTED')}
                        disabled={updatingId === req.id}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange(req.id, 'CONFIRMED')}
                        disabled={updatingId === req.id}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Accept Booking</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
