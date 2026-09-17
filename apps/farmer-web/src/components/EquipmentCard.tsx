import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, Navigation } from 'lucide-react';

interface EquipmentCardProps {
  item: {
    id: string;
    title: string;
    equipmentType: string;
    brand: string;
    model: string;
    description: string;
    pricePerDay: number;
    locationName: string;
    imageUrl: string;
    verificationStatus: string;
    distanceKm: number;
    isAvailable: boolean;
    owner: {
      name: string;
      businessName?: string;
      phone: string;
      location: string;
    };
  };
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden transition flex flex-col h-full">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold">
          {item.equipmentType}
        </div>
        {item.verificationStatus === 'VERIFIED' && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center space-x-1 shadow">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Verified Owner</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{item.title}</h3>
          </div>

          <p className="text-xs text-slate-500 font-medium mt-1">
            {item.brand} • {item.model}
          </p>

          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.description}</p>

          <div className="mt-4 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-1 text-slate-700 font-medium">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{item.locationName}</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-700 font-medium">
              <Navigation className="h-3.5 w-3.5 text-emerald-600" />
              <span>Approx. {item.distanceKm} km from your location</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-emerald-700">₹{item.pricePerDay.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500 block font-medium">per day rental</span>
          </div>

          <Link
            to={`/equipment/${item.id}`}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
          >
            View & Book
          </Link>
        </div>
      </div>
    </div>
  );
};
