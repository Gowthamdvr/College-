import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/mockDatabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Stethoscope, CalendarCheck, TrendingUp, ArrowUp, FileText } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0,
    pending: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        // Fetch data from simulated DB
        const [users, doctors, appointments] = await Promise.all([
            db.getUsers(),
            db.getDoctors(),
            db.getAppointments()
        ]);

        setStats({
            users: users.length,
            doctors: doctors.length,
            appointments: appointments.length,
            pending: appointments.filter(a => a.status === 'pending').length
        });

        // Prepare chart data (Appointments by Status)
        const statusCounts = appointments.reduce((acc: any, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {});

        setChartData([
            { name: 'Pending', count: statusCounts['pending'] || 0 },
            { name: 'Approved', count: statusCounts['approved'] || 0 },
            { name: 'Completed', count: statusCounts['completed'] || 0 },
            { name: 'Cancelled', count: statusCounts['cancelled'] || 0 },
        ]);
    };

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    const doc = new jsPDF();
    const appointments = await db.getAppointments();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136); // Teal color
    doc.text("Gowtham Hospital", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Pollachi, Tamil Nadu, India", 14, 28);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 34);

    doc.line(14, 38, 196, 38); // Horizontal line

    // Table Data
    const tableColumn = ["Date", "Time", "Patient", "Doctor", "Status", "Reason"];
    const tableRows = appointments.map(apt => [
      apt.date,
      apt.time,
      apt.userName,
      apt.doctorName,
      apt.status,
      apt.reason
    ]);

    // Generate Table
    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [13, 148, 136], // Teal-600
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 3 
      },
      alternateRowStyles: {
        fillColor: [240, 253, 250] // Teal-50
      }
    });

    // Footer
    const pageCount = (doc.internal as any).getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }

    doc.save(`gowtham_hospital_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, trend }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend === 'up' ? (
           <span className="text-green-600 flex items-center font-medium bg-green-50 px-2 py-0.5 rounded-md">
             <ArrowUp size={14} className="mr-1" /> +12%
           </span>
        ) : (
           <span className="text-gray-400 flex items-center font-medium">
             Updated just now
           </span>
        )}
        <span className="text-gray-400 ml-2">from last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
         <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Doctors" 
          value={stats.doctors} 
          icon={Stethoscope} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50"
          trend="up"
        />
        <StatCard 
          title="Total Patients" 
          value={stats.users} 
          icon={Users} 
          colorClass="text-teal-600" 
          bgClass="bg-teal-50"
          trend="up"
        />
        <StatCard 
          title="Appointments" 
          value={stats.appointments} 
          icon={CalendarCheck} 
          colorClass="text-purple-600" 
          bgClass="bg-purple-50"
          trend="up"
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pending} 
          icon={TrendingUp} 
          colorClass="text-orange-600" 
          bgClass="bg-orange-50"
          trend="neutral"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Appointment Analytics</h2>
            <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-teal-500 focus:border-teal-500">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
           <div className="space-y-3">
              <button 
                onClick={() => navigate('/dashboard/doctors')}
                className="w-full flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-gray-700 font-medium text-sm"
              >
                 <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-teal-600"><Users size={18} /></div>
                 Add New Doctor
              </button>
              <button 
                onClick={() => navigate('/dashboard/appointments')}
                className="w-full flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-gray-700 font-medium text-sm"
              >
                 <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-blue-600"><CalendarCheck size={18} /></div>
                 Review Pending Appointments
              </button>
              <button 
                onClick={handleGenerateReport}
                className="w-full flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-gray-700 font-medium text-sm"
              >
                 <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-purple-600"><FileText size={18} /></div>
                 Generate Report (PDF)
              </button>
           </div>

           <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3">System Status</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Server Uptime</span>
                    <span className="text-green-600 font-medium">99.9%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Database Load</span>
                    <span className="text-blue-600 font-medium">12%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[12%]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
