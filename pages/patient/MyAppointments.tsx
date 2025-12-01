import React, { useEffect, useState } from 'react';
import { db } from '../../services/mockDatabase';
import { Appointment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User } from 'lucide-react';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
        if (user) {
            const all = await db.getAppointments();
            const myApts = all.filter(a => a.userId === user.id);
            setAppointments(myApts.reverse());
        }
    }
    fetch();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      
      <div className="space-y-4">
        {appointments.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-xl shadow-sm">
             <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
             <p className="text-gray-500">You haven't booked any appointments yet.</p>
           </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <div className="flex items-center mb-2">
                   <h3 className="font-bold text-lg text-gray-900 mr-2">Dr. {apt.doctorName}</h3>
                   <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide 
                      ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        apt.status === 'approved' ? 'bg-green-100 text-green-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {apt.status}
                   </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                   <div className="flex items-center">
                     <Calendar size={14} className="mr-2" /> {apt.date}
                   </div>
                   <div className="flex items-center">
                     <Clock size={14} className="mr-2" /> {apt.time}
                   </div>
                   <p className="mt-2 text-gray-700 italic">"{apt.reason}"</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                 {/* Can add Cancel button here for patient if status is pending */}
                 {apt.status === 'pending' && (
                   <span className="text-xs text-gray-400">Waiting for doctor approval</span>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
