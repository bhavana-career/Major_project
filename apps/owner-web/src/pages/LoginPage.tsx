import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, Phone, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(phone, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="inline-flex bg-amber-100 p-3 rounded-2xl text-amber-800 mb-3">
            <Tractor className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Equipment Owner Login</h2>
          <p className="mt-1 text-sm text-slate-500">Manage machinery listings & booking requests</p>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold text-sm shadow transition disabled:opacity-50"
          >
            {submitting ? 'Logging in...' : 'Sign In to Owner Portal'}
          </button>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
            <strong>Demo Owner Credentials:</strong>
            <br />
            Phone: <code className="font-mono">9876543210</code> | Password: <code className="font-mono">password123</code>
          </div>

          <div className="text-center mt-4">
            <span className="text-xs text-slate-500">Don't have an owner account? </span>
            <Link to="/register" className="text-xs font-bold text-amber-700 hover:underline">
              Register via OTP
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
