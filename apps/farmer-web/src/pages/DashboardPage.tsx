import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { EquipmentCard } from '../components/EquipmentCard';
import { Search, Filter, Tractor, Calendar, MapPin, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [query, setQuery] = useState('');
  const [equipmentType, setEquipmentType] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (equipmentType && equipmentType !== 'ALL') params.append('equipmentType', equipmentType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const data = await apiRequest<any[]>(`/equipment?${params.toString()}`);
      setEquipmentList(data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEquipment();
  };

  const categories = [
    { label: 'All Equipment', value: 'ALL' },
    { label: 'Tractors', value: 'Tractor' },
    { label: 'Harvesters', value: 'Harvester' },
    { label: 'Tillers & Rotavators', value: 'Tiller' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="bg-emerald-700/60 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Managed Agricultural Machinery Access
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              Rent Farm Machinery Nearby
            </h1>
            <p className="mt-2 text-sm text-emerald-100">
              Access verified tractors, harvesters, and tillers for your farm with location & date availability awareness.
            </p>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-4 rounded-2xl shadow-xl text-slate-800 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tractor, brand, model..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <select
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                title="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                title="End Date"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow transition flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search Available</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Pills */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setEquipmentType(c.value);
                  fetchEquipment();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  equipmentType === c.value
                    ? 'bg-emerald-700 text-white shadow-emerald-200'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchEquipment}
            className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-3 text-sm text-slate-500 font-medium">Searching equipment database...</p>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <Tractor className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No machinery found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              No equipment matching your criteria was found. Try clearing date or type filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
