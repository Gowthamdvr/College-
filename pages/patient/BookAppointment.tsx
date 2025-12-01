import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { Doctor } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Calendar, Clock } from 'lucide-react';

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
        const docs = await db.getDoctors();
        setDoctors(docs);
    }
    fetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === selectedDoc);
    if (!doc || !user) return;

    await db.addAppointment({
      id: `apt-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      doctorId: doc.id,
      doctorName: doc.name,
      date,
      time,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    alert('Appointment booked successfully! Waiting for approval.');
    navigate('/dashboard/my-appointments');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
            <div className="grid grid-cols-1 gap-4">
              {doctors.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition ${selectedDoc === doc.id ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-teal-100 p-2 rounded-full mr-4">
                        <Stethoscope className="text-teal-600 h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>Mon-Fri</p>
                    <p>{doc.availableTimeStart} - {doc.availableTimeEnd}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                    <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="relative">
                    <input
                    type="time"
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    />
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
              placeholder="Briefly describe your symptoms..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!selectedDoc}
            className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Booking
          </button>

        </form>
      </div>
    </div>
  );
}
