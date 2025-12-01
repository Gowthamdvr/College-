import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { Doctor } from '../../types';
import { Trash2, Plus, Mail, Stethoscope, Search, Edit2, Calendar, Clock, Check } from 'lucide-react';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = {
    name: '',
    email: '',
    specialization: '',
    phone: '',
    password: 'password123',
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as string[]
  };

  const [formData, setFormData] = useState(initialFormState);

  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const fetchDoctors = async () => {
    const docs = await db.getDoctors();
    setDoctors(docs);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      await db.deleteDoctor(id);
      fetchDoctors();
    }
  };

  const handleEdit = (doc: Doctor) => {
    setEditingId(doc.id);
    setFormData({
      name: doc.name,
      email: doc.email,
      specialization: doc.specialization,
      phone: doc.phone || '',
      password: doc.password || 'password123',
      availableTimeStart: doc.availableTimeStart,
      availableTimeEnd: doc.availableTimeEnd,
      availableDays: doc.availableDays
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const days = prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day];
      // Sort days based on WEEKDAYS order
      days.sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
      return { ...prev, availableDays: days };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing
      const existingDoc = doctors.find(d => d.id === editingId);
      if (existingDoc) {
        const updatedDoc: Doctor = {
          ...existingDoc,
          ...formData,
        };
        await db.updateDoctor(updatedDoc);
      }
    } else {
      // Create new
      const docToAdd: Doctor = {
        ...formData,
        id: `doc-${Date.now()}`,
        role: 'doctor',
        experience: 5, // Default for now
        createdAt: new Date().toISOString()
      };
      await db.addDoctor(docToAdd);
    }

    await fetchDoctors();
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-full sm:w-64"
            />
          </div>
          
          <button 
            onClick={handleAddNew}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-teal-700 transition"
          >
            <Plus size={18} className="mr-2" />
            Add Doctor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doc => (
            <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl mr-4">
                  {doc.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-teal-600 font-medium flex items-center">
                    <Stethoscope size={14} className="mr-1" />
                    {doc.specialization}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 flex-1">
                <div className="flex items-center">
                  <Mail size={14} className="mr-2" />
                  {doc.email}
                </div>
                <div>
                  <div className="flex items-center mb-1 font-semibold text-gray-700">
                    <Calendar size={14} className="mr-2" />
                    Available Days
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {doc.availableDays.map(day => (
                      <span key={day} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs border">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-2" />
                  <span className="font-semibold mr-1">Time:</span>
                  {doc.availableTimeStart} - {doc.availableTimeEnd}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <button 
                  onClick={() => handleEdit(doc)}
                  className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition text-sm font-medium"
                >
                  <Edit2 size={16} className="mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No doctors found matching "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="mt-2 text-teal-600 hover:underline">Clear search</button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    placeholder="Dr. John Doe" 
                    required 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    placeholder="doctor@example.com" 
                    type="email" 
                    required 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input 
                    placeholder="e.g. Cardiologist" 
                    required 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                    value={formData.specialization}
                    onChange={e => setFormData({...formData, specialization: e.target.value})}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    placeholder="(555) 000-0000" 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Visual Weekly Schedule */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                  <Calendar size={16} className="mr-2 text-teal-600" />
                  Weekly Schedule & Availability
                </h3>
                
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-2 uppercase font-semibold">Available Days</label>
                  <div className="flex justify-between gap-1">
                    {WEEKDAYS.map(day => {
                      const isSelected = formData.availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all
                            ${isSelected 
                              ? 'bg-teal-600 text-white shadow-md transform scale-105' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }
                          `}
                          title={isSelected ? 'Available' : 'Unavailable'}
                        >
                          {day.charAt(0)}
                          {isSelected && <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">Tap days to toggle availability</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">Start Time</label>
                     <input 
                       type="time" 
                       className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                       value={formData.availableTimeStart}
                       onChange={e => setFormData({...formData, availableTimeStart: e.target.value})}
                    />
                   </div>
                   <div>
                     <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">End Time</label>
                     <input 
                       type="time" 
                       className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                       value={formData.availableTimeEnd}
                       onChange={e => setFormData({...formData, availableTimeEnd: e.target.value})}
                    />
                   </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium shadow-sm transition flex items-center"
                >
                  {editingId ? <Check size={18} className="mr-2"/> : <Plus size={18} className="mr-2"/>}
                  {editingId ? 'Update Doctor' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
