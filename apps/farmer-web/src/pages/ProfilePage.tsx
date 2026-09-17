import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { User as UserIcon, Phone, MapPin, Sprout, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [totalLandAcres, setTotalLandAcres] = useState<number>(0);
  const [primaryCrops, setPrimaryCrops] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiRequest<any>('/farmers/profile');
        setProfile(data);
        if (data) {
          setDistrict(data.district || '');
          setTaluk(data.taluk || '');
          setVillage(data.village || '');
          setTotalLandAcres(data.totalLandAcres || 0);
          setPrimaryCrops(data.primaryCrops || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/farmers/profile', {
        method: 'PUT',
        body: JSON.stringify({
          district,
          taluk,
          village,
          totalLandAcres: Number(totalLandAcres),
          primaryCrops,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-2 text-sm text-slate-500">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
          <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-800">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{user?.phone} (Verified Farmer Account)</span>
            </p>
          </div>
        </div>

        {saved && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800">
            Farm & Location Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Taluk</label>
              <input
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Landholding (Acres)</label>
              <input
                type="number"
                step="0.1"
                value={totalLandAcres}
                onChange={(e) => setTotalLandAcres(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Cultivated Crops</label>
              <input
                type="text"
                value={primaryCrops}
                onChange={(e) => setPrimaryCrops(e.target.value)}
                placeholder="e.g. Paddy, Sugarcane, Maize"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition"
          >
            Save Profile Details
          </button>
        </form>
      </div>
    </div>
  );
};
