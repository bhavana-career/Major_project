import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, CheckCircle, Navigation, Calendar, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await apiRequest<any>(`/equipment/${id}`);
        setEquipment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id]);

  const calculateDaysAndTotal = () => {
    if (!startDate || !endDate) return { days: 0, total: 0 };
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (s > e) return { days: 0, total: 0 };
    const diff = Math.abs(e.getTime() - s.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    const total = days * (equipment?.pricePerDay || 0);
    return { days, total };
  };

  const { days, total } = calculateDaysAndTotal();

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingError('');
    setSubmitting(true);
    try {
      await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          equipmentId: id,
          startDate,
          endDate,
          notes,
        }),
      });
      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err: any) {
      setBookingError(err.message || 'Booking submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-2 text-sm text-slate-500">Loading machinery specifications...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Equipment Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-700 font-semibold underline">
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-1 text-sm text-slate-600 hover:text-emerald-700 font-medium mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 columns: Equipment details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-72 sm:h-96 bg-slate-100 relative">
                <img src={equipment.imageUrl} alt={equipment.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {equipment.equipmentType}
                </div>
                {equipment.verificationStatus === 'VERIFIED' && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Verified Equipment</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{equipment.title}</h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Brand: {equipment.brand} • Model: {equipment.model}
                </p>

                <div className="mt-4 flex items-center space-x-4 text-xs font-medium text-slate-600 flex-wrap gap-y-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{equipment.locationName}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
                    <Navigation className="h-4 w-4 text-emerald-600" />
                    <span>{equipment.distanceKm} km from your farm</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Description & Capabilities</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{equipment.description}</p>
                </div>

                {equipment.specs && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Technical Specifications</h3>
                    <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 font-mono">
                      {equipment.specs}
                    </div>
                  </div>
                )}

                {/* Owner Information Card */}
                <div className="mt-6 border-t border-slate-100 pt-6 bg-emerald-50/60 p-4 rounded-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Equipment Provider</h3>
                  <p className="text-sm font-bold text-slate-900">{equipment.owner.name}</p>
                  <p className="text-xs text-slate-600">{equipment.owner.businessName}</p>
                  <p className="text-xs text-slate-500 mt-1">Contact: {equipment.owner.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sticky top-24">
              <div className="flex justify-between items-baseline mb-4">
                <div>
                  <span className="text-3xl font-extrabold text-emerald-700">₹{equipment.pricePerDay.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-500 font-medium block">per day rental fee</span>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                  Available
                </span>
              </div>

              {bookingSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Booking Request Sent!</h4>
                  <p className="text-xs text-emerald-700">
                    The equipment owner has been notified. Redirecting to your bookings dashboard...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rental Start Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rental End Date</label>
                    <input
                      type="date"
                      required
                      min={startDate || new Date().toISOString().split('T')[0]}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Special Notes (Optional)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Need for paddy land tilling in Koppa village..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {days > 0 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between text-slate-600">
                        <span>Duration:</span>
                        <span className="font-bold text-slate-900">{days} day(s)</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Daily Rate:</span>
                        <span>₹{equipment.pricePerDay.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                        <span>Estimated Total:</span>
                        <span className="text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || days <= 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Request...' : 'Submit Booking Request'}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    No payment is charged now. Payment arrangement will be finalized upon Owner confirmation.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
