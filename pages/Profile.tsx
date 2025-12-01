import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDatabase';
import { Doctor, User } from '../types';
import { User as UserIcon, Mail, Phone, Lock, Save, Calendar, Clock, Briefcase, Award, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const isDoctor = user?.role === 'doctor';
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    if (user) {
      // Create a copy of the user data to edit
      setFormData(JSON.parse(JSON.stringify(user)));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDay = (day: string) => {
    const currentDays = formData.availableDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d: string) => d !== day)
      : [...currentDays, day];
    
    // Sort days
    newDays.sort((a: string, b: string) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
    setFormData({ ...formData, availableDays: newDays });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (isDoctor) {
        await db.updateDoctor(formData as Doctor);
      } else {
        await db.updateUser(formData as User);
      }
      
      updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-500">Manage your personal information and preferences.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <CheckCircle size={20} className="mr-2" />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <UserIcon className="mr-2 text-teal-600 h-5 w-5" />
              Personal Information
            </h2>
            
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={formData.name || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                    value={formData.email || ''}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {isDoctor && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="mr-2 text-teal-600 h-5 w-5" />
                  Professional Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                      <div className="relative">
                          <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="specialization"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            value={formData.specialization || ''}
                            onChange={handleChange}
                          />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience (Years)</label>
                      <div className="relative">
                          <Award className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="number"
                            name="experience"
                            min="0"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            value={formData.experience || 0}
                            onChange={handleChange}
                          />
                      </div>
                   </div>
                </div>
             </div>
          )}

          {isDoctor && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="mr-2 text-teal-600 h-5 w-5" />
                Schedule & Availability
              </h2>
              
              <div className="mb-6">
                <label className="block text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(day => {
                    const isSelected = formData.availableDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                          ${isSelected 
                            ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-600 ring-offset-1' 
                            : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        {day.charAt(0)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Start Time</label>
                    <div className="relative">
                       <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                       <input 
                        type="time" 
                        name="availableTimeStart"
                        className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        value={formData.availableTimeStart || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">End Time</label>
                    <div className="relative">
                       <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                       <input 
                        type="time" 
                        name="availableTimeEnd"
                        className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        value={formData.availableTimeEnd || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Security & Save */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="mr-2 text-teal-600 h-5 w-5" />
              Security
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                value={formData.password || ''}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
              <p className="text-xs text-gray-400 mt-2">Recommended: Use at least 8 characters with numbers and symbols.</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-600/20 flex items-center justify-center"
          >
            <Save className="mr-2 h-5 w-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
