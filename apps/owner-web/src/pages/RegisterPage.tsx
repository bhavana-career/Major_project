import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, Phone, Lock, User as UserIcon, Building, MapPin, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'DETAILS'>('PHONE');
  const [phone, setPhone] = useState('9900112233');
  const [otp, setOtp] = useState('');
  const [devOtpCode, setDevOtpCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [district, setDistrict] = useState('Mandya');
  const [locationName, setLocationName] = useState('Mandya, Karnataka');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { sendOtp, verifyOtp, register } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await sendOtp(phone);
      if (res.devOtp) {
        setDevOtpCode(res.devOtp);
        setOtp(res.devOtp);
      }
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = await verifyOtp(phone, otp);
      setVerificationToken(token);
      setStep('DETAILS');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        phone,
        password,
        name,
        verificationToken,
        businessName: businessName || `${name}'s Equipment Rentals`,
        district,
        locationName,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex bg-amber-100 p-3 rounded-2xl text-amber-800 mb-2">
            <Tractor className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Equipment Owner Registration</h2>
          <p className="text-xs text-slate-500 mt-1">Phone OTP Verification • Step {step === 'PHONE' ? '1' : step === 'OTP' ? '2' : '3'} of 3</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Mobile Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold text-sm shadow transition disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {devOtpCode && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-xs">
                <span className="font-bold">Development Mode OTP:</span> <code className="font-mono text-sm bg-amber-100 px-2 py-0.5 rounded">{devOtpCode}</code>
                <p className="text-[11px] text-amber-700 mt-1">(Printed to server console in Dev mode)</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-digit OTP Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="123456"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold text-sm shadow transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Continue'}
            </button>
          </form>
        )}

        {step === 'DETAILS' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="bg-amber-50 text-amber-900 text-xs px-3 py-2 rounded-lg flex items-center space-x-2 border border-amber-200">
              <CheckCircle className="h-4 w-4 text-amber-600" />
              <span>Phone number verified: {phone}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Business Contact Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Ramesh Gowda"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Business / Service Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Gowda Agro Equipment Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location Name</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Set Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold text-sm shadow transition disabled:opacity-50"
            >
              {loading ? 'Creating Owner Account...' : 'Complete Owner Profile'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <span className="text-xs text-slate-500">Already registered as an Owner? </span>
          <Link to="/login" className="text-xs font-bold text-amber-700 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
