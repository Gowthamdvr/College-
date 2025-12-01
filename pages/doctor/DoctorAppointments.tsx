import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { Appointment, Doctor } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Clock, Edit, X, Save, Calendar, User as UserIcon, Briefcase, Phone } from 'lucide-react';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user, updateProfile } = useAuth();
  
  // Profile Edit State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<Partial<Doctor>>({});

  const isDoctor = user?.role === 'doctor';
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const fetchAppointments = async () => {
    if (user) {
        // Filter appointments
        const all = await db.getAppointments();
        const myApts = user.role === 'admin' 
          ? all 
          : all.filter(a => a.doctorId === user.id);
        
        setAppointments(myApts.reverse());
    }
  };

  useEffect(() => {
      fetchAppointments();

      // Init profile data if doctor
      if (isDoctor && user) {
        setProfileData({ 
            ...(user as Doctor),
            availableDays: (user as Doctor).availableDays || []
        });
      }
  }, [user, isDoctor]);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    await db.updateAppointmentStatus(id, status);
    fetchAppointments();
  };

  const toggleDay = (day: string) => {
    const currentDays = profileData.availableDays || [];
    const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
    
    newDays.sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
    setProfileData({ ...profileData, availableDays: newDays });
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDoctor) return;
    
    const updated = { ...(user as Doctor), ...profileData } as Doctor;
    await db.updateDoctor(updated);
    updateProfile(updated);
    setIsProfileOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">
                {user?.role === 'admin' ? 'All Appointments' : 'Doctor Portal'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your schedule and patient visits</p>
        </div>
        
        {isDoctor && (
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium"
          >
            <Edit size={18} className="text-teal-600" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <h2 className="font-semibold text-gray-700 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                Appointments List
             </h2>
             <span className="text-xs font-medium bg-white px-2 py-1 rounded border text-gray-500">
                {appointments.length} Total
             </span>
        </div>
        
        {appointments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No appointments found.</p>
            <p className="text-gray-400 text-sm mt-1">New bookings will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.map(apt => (
              <li key={apt.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{apt.userName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1.5">
                      {user?.role === 'admin' && (
                          <p className="font-medium text-teal-700 flex items-center">
                              <UserIcon size={14} className="mr-1.5" /> 
                              Dr. {apt.doctorName}
                          </p>
                      )}
                      <p className="flex items-center text-gray-700">
                          <Clock size={14} className="mr-1.5 text-gray-400"/> 
                          <span className="font-medium mr-1">{apt.date}</span> at <span className="font-medium ml-1">{apt.time}</span>
                      </p>
                      <div className="bg-gray-50 p-2 rounded-lg inline-block max-w-md">
                        <span className="font-medium text-gray-900 text-xs uppercase block mb-1">Reason</span>
                        <p className="text-gray-700 leading-relaxed">{apt.reason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {apt.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          className="flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition text-sm font-medium"
                        >
                          <XCircle size={16} className="mr-2" />
                          Decline
                        </button>
                        <button 
                          onClick={() => handleStatusChange(apt.id, 'approved')}
                          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-sm transition text-sm font-medium"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </button>
                      </>
                    )}

                    {apt.status === 'approved' && (
                      <button 
                        onClick={() => handleStatusChange(apt.id, 'completed')}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition text-sm font-medium"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Mark Complete
                      </button>
                    )}
                    
                    {apt.status === 'cancelled' && (
                         <span className="text-gray-400 text-sm italic px-2">Cancelled</span>
                    )}
                    {apt.status === 'completed' && (
                         <span className="text-blue-600 text-sm font-medium px-2 flex items-center"><CheckCircle size={14} className="mr-1"/> Completed</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-teal-600">
                    <UserIcon size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                    <p className="text-xs text-gray-500">Update your information</p>
                </div>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={saveProfile} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input 
                            required 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            value={profileData.name || ''}
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input 
                                required 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                value={profileData.specialization || ''}
                                onChange={e => setProfileData({...profileData, specialization: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience (Years)</label>
                        <input 
                            type="number"
                            min="0"
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            value={profileData.experience || 0}
                            onChange={e => setProfileData({...profileData, experience: parseInt(e.target.value) || 0})}
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            value={profileData.phone || ''}
                            onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <Calendar size={16} className="mr-2 text-teal-600" />
                      Availability
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Weekly Schedule</label>
                      <div className="flex flex-wrap gap-2">
                        {WEEKDAYS.map(day => {
                          const isSelected = profileData.availableDays?.includes(day);
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
                         <input 
                           type="time" 
                           className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                           value={profileData.availableTimeStart || ''}
                           onChange={e => setProfileData({...profileData, availableTimeStart: e.target.value})}
                        />
                       </div>
                       <div>
                         <label className="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">End Time</label>
                         <input 
                           type="time" 
                           className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                           value={profileData.availableTimeEnd || ''}
                           onChange={e => setProfileData({...profileData, availableTimeEnd: e.target.value})}
                        />
                       </div>
                    </div>
                  </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsProfileOpen(false)}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium shadow-lg shadow-teal-600/20 transition flex items-center"
                >
                  <Save size={18} className="mr-2"/>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
