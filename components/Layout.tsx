import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isBackendEnabled } from '../services/mockDatabase';
import { 
  Activity, 
  LayoutDashboard, 
  Calendar, 
  User, 
  Users, 
  Stethoscope, 
  LogOut,
  Menu,
  X,
  Bell,
  Wifi,
  WifiOff
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-4 border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-teal-600 p-2 rounded-lg mr-2 group-hover:bg-teal-700 transition">
                <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Gowtham Hospital</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-teal-600 font-medium transition">Home</Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-teal-600 font-medium transition">Login</Link>
                  <Link to="/register" className="bg-teal-600 text-white hover:bg-teal-700 px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30">Sign Up</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-teal-600 font-medium transition">Dashboard</Link>
                  <div className="flex items-center ml-4 pl-6 border-l border-gray-200">
                    <div className="text-right mr-3">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 p-2 rounded-full transition">
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const role = user?.role;

  const NavItem = ({ to, icon: Icon, label }: any) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-3 mx-3 my-1 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive 
            ? 'bg-teal-50 text-teal-700 shadow-sm' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <Icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
        {label}
        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600"></div>}
      </Link>
    );
  };

  const getLinks = () => {
    if (role === 'admin') {
      return (
        <>
          <div className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Analytics</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
          <div className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">Management</div>
          <NavItem to="/dashboard/doctors" icon={Stethoscope} label="Doctors" />
          <NavItem to="/dashboard/users" icon={Users} label="Patients" />
          <NavItem to="/dashboard/appointments" icon={Calendar} label="All Appointments" />
        </>
      );
    }
    if (role === 'doctor') {
      return (
        <>
          <div className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
          <NavItem to="/dashboard/appointments" icon={Calendar} label="Appointments" />
          <div className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">Account</div>
          <NavItem to="/dashboard/profile" icon={User} label="My Profile" />
        </>
      );
    }
    return ( // User
      <>
        <div className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Personal</div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
        <NavItem to="/dashboard/book" icon={Stethoscope} label="Book Appointment" />
        <NavItem to="/dashboard/my-appointments" icon={Calendar} label="My History" />
        <NavItem to="/dashboard/profile" icon={User} label="Profile" />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
           <div className="h-16 flex items-center px-6 border-b border-gray-50">
              <Activity className="h-7 w-7 text-teal-600 mr-2" />
              <span className="text-lg font-bold text-gray-900 tracking-tight">Gowtham Hospital</span>
           </div>
           
           <nav className="flex-1 overflow-y-auto py-4">
              {getLinks()}
           </nav>

           {/* System Status Indicator */}
           <div className="px-6 py-3">
             <div className={`rounded-lg p-2 text-xs font-medium flex items-center ${isBackendEnabled ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                {isBackendEnabled ? <Wifi size={14} className="mr-2"/> : <WifiOff size={14} className="mr-2"/>}
                {isBackendEnabled ? 'Connected to Backend' : 'Demo Mode (Offline)'}
             </div>
           </div>

           <div className="p-4 border-t border-gray-50">
             <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} className="text-gray-400 hover:text-red-50 hover:text-red-500 transition">
                  <LogOut size={18} />
                </button>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center">
            <button 
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center space-x-2">
               <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                 {user?.name.charAt(0)}
               </div>
               <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
           {children}
        </main>
      </div>
    </div>
  );
};