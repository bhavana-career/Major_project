import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Plus, Wrench, CheckCircle, MapPin, X, Edit, Power, AlertCircle } from 'lucide-react';

export const MyEquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Add Equipment Form state
  const [title, setTitle] = useState('');
  const [equipmentType, setEquipmentType] = useState('Tractor');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [locationName, setLocationName] = useState('Mandya, Karnataka');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800&q=80');
  const [specs, setSpecs] = useState('');

  const fetchOwnedEquipment = async () => {
    try {
      const data = await apiRequest<any[]>('/equipment/my-equipment');
      setEquipmentList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnedEquipment();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/equipment/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchOwnedEquipment();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiRequest('/equipment', {
        method: 'POST',
        body: JSON.stringify({
          title,
          equipmentType,
          brand,
          model,
          description,
          pricePerDay: Number(pricePerDay),
          locationName,
          imageUrl,
          specs,
        }),
      });
      setShowModal(false);
      // Reset form
      setTitle('');
      setBrand('');
      setModel('');
      setDescription('');
      setPricePerDay('');
      fetchOwnedEquipment();
    } catch (err: any) {
      setError(err.message || 'Failed to add equipment.');
    } finally {
      setSubmitting(false);
    }
  };

  const sampleImages = [
    { label: 'Tractor Image', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800&q=80' },
    { label: 'Harvester Image', url: 'https://images.unsplash.com/photo-1530267981608-bc70a27e9877?w=800&q=80' },
    { label: 'Tiller / Cultivator Image', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Equipment Inventory</h1>
            <p className="text-xs text-slate-500">Manage equipment specs, daily rates, and availability status</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Equipment</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Loading equipment inventory...</p>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
            <Wrench className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Equipment Added Yet</h3>
            <p className="text-xs text-slate-500 mt-1">Click the button above to add your first tractor or harvester.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow transition flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      {item.equipmentType}
                    </div>
                    <div
                      className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 shadow ${
                        item.isActive ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      <Power className="h-3 w-3" />
                      <span>{item.isActive ? 'Listed Active' : 'Deactivated'}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.brand} • {item.model}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.description}</p>

                    <div className="pt-2 flex items-center space-x-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{item.locationName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xl font-extrabold text-amber-700">₹{item.pricePerDay.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-500 block">/ day</span>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(item.id, item.isActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      item.isActive
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>{item.isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add Equipment */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 my-8">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Add Machinery Listing</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mahindra 575 DI 45 HP Tractor"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Type</label>
                    <select
                      value={equipmentType}
                      onChange={(e) => setEquipmentType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Tractor">Tractor</option>
                      <option value="Harvester">Harvester</option>
                      <option value="Tiller">Power Tiller</option>
                      <option value="Rotavator">Rotavator</option>
                      <option value="Sprayer">Sprayer</option>
                      <option value="Seeder">Seeder / Planter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Rental Rate (₹)</label>
                    <input
                      type="number"
                      required
                      value={pricePerDay}
                      onChange={(e) => setPricePerDay(e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Mahindra"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Model</label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. 575 DI"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location Name</label>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Mandya, Karnataka"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe attachments, condition, HP specs..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sample Image URL</label>
                  <select
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {sampleImages.map((s) => (
                      <option key={s.url} value={s.url}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Add Equipment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
