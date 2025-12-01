import { User, Doctor, Appointment, Role, IDatabaseService } from '../types';
import { apiDatabase } from './api';

// Set this to true ONLY if you have the Node.js server running on port 5000
// and MongoDB connected. Otherwise, keep it false to use the mock database.
const USE_BACKEND_API = false;

// Export status for UI
export const isBackendEnabled = USE_BACKEND_API;

// Seed Data (Kept for reference or fallback)
const SEED_ADMIN: User = {
  id: 'admin-1',
  name: 'System Admin',
  email: 'admin@gowthamhospital.com',
  password: 'password',
  role: 'admin',
  phone: '000-000-0000',
  createdAt: new Date().toISOString(),
};

const SEED_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Smith',
    email: 'sarah@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Cardiologist',
    experience: 12,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeStart: '09:00',
    availableTimeEnd: '14:00',
    phone: '555-0101',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-2',
    name: 'Dr. James Wilson',
    email: 'james@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Dermatologist',
    experience: 8,
    availableDays: ['Tue', 'Thu'],
    availableTimeStart: '10:00',
    availableTimeEnd: '16:00',
    phone: '555-0102',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-3',
    name: 'Dr. Emily Chen',
    email: 'emily@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Pediatrician',
    experience: 10,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    availableTimeStart: '08:00',
    availableTimeEnd: '15:00',
    phone: '555-0103',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-4',
    name: 'Dr. Michael Brown',
    email: 'michael@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Neurologist',
    experience: 15,
    availableDays: ['Wed', 'Thu', 'Fri'],
    availableTimeStart: '10:00',
    availableTimeEnd: '18:00',
    phone: '555-0104',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-5',
    name: 'Dr. Lisa Taylor',
    email: 'lisa@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Gynecologist',
    experience: 14,
    availableDays: ['Mon', 'Wed', 'Sat'],
    availableTimeStart: '09:00',
    availableTimeEnd: '13:00',
    phone: '555-0105',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-6',
    name: 'Dr. David Miller',
    email: 'david@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Orthopedic Surgeon',
    experience: 20,
    availableDays: ['Tue', 'Thu', 'Fri'],
    availableTimeStart: '07:00',
    availableTimeEnd: '15:00',
    phone: '555-0106',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-7',
    name: 'Dr. Jennifer Davis',
    email: 'jennifer@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Psychiatrist',
    experience: 9,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu'],
    availableTimeStart: '11:00',
    availableTimeEnd: '19:00',
    phone: '555-0107',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-8',
    name: 'Dr. Robert Wilson',
    email: 'robert@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'General Physician',
    experience: 25,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeStart: '08:00',
    availableTimeEnd: '20:00',
    phone: '555-0108',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-9',
    name: 'Dr. Maria Garcia',
    email: 'maria@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Ophthalmologist',
    experience: 7,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    phone: '555-0109',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-10',
    name: 'Dr. William Anderson',
    email: 'william@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'ENT Specialist',
    experience: 11,
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimeStart: '10:00',
    availableTimeEnd: '14:00',
    phone: '555-0110',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-11',
    name: 'Dr. Linda Martinez',
    email: 'linda@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Endocrinologist',
    experience: 13,
    availableDays: ['Mon', 'Tue', 'Thu'],
    availableTimeStart: '09:30',
    availableTimeEnd: '16:30',
    phone: '555-0111',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-12',
    name: 'Dr. Richard Thomas',
    email: 'richard@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Urologist',
    experience: 16,
    availableDays: ['Wed', 'Fri', 'Sat'],
    availableTimeStart: '08:00',
    availableTimeEnd: '12:00',
    phone: '555-0112',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-13',
    name: 'Dr. Patricia Jackson',
    email: 'patricia@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Oncologist',
    experience: 18,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeStart: '10:00',
    availableTimeEnd: '16:00',
    phone: '555-0113',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-14',
    name: 'Dr. Joseph White',
    email: 'joseph@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Gastroenterologist',
    experience: 14,
    availableDays: ['Tue', 'Thu'],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    phone: '555-0114',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-15',
    name: 'Dr. Karen Harris',
    email: 'karen@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Pulmonologist',
    experience: 12,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeStart: '13:00',
    availableTimeEnd: '19:00',
    phone: '555-0115',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-16',
    name: 'Dr. Thomas Clark',
    email: 'thomas@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Rheumatologist',
    experience: 9,
    availableDays: ['Wed', 'Fri'],
    availableTimeStart: '08:30',
    availableTimeEnd: '14:30',
    phone: '555-0116',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-17',
    name: 'Dr. Nancy Lewis',
    email: 'nancy@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Nephrologist',
    experience: 11,
    availableDays: ['Mon', 'Thu'],
    availableTimeStart: '10:00',
    availableTimeEnd: '15:00',
    phone: '555-0117',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-18',
    name: 'Dr. Charles Robinson',
    email: 'charles@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Radiologist',
    experience: 6,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeStart: '08:00',
    availableTimeEnd: '16:00',
    phone: '555-0118',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-19',
    name: 'Dr. Susan Walker',
    email: 'susan@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Anesthesiologist',
    experience: 19,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeStart: '07:00',
    availableTimeEnd: '19:00',
    phone: '555-0119',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-20',
    name: 'Dr. Christopher Hall',
    email: 'christopher@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Plastic Surgeon',
    experience: 15,
    availableDays: ['Tue', 'Thu'],
    availableTimeStart: '11:00',
    availableTimeEnd: '17:00',
    phone: '555-0120',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-21',
    name: 'Dr. Jessica Allen',
    email: 'jessica@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Pathologist',
    experience: 8,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    phone: '555-0121',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-22',
    name: 'Dr. Matthew Young',
    email: 'matthew@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Sports Medicine',
    experience: 7,
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimeStart: '08:00',
    availableTimeEnd: '12:00',
    phone: '555-0122',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-23',
    name: 'Dr. Barbara King',
    email: 'barbara@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Geriatrician',
    experience: 22,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeStart: '10:00',
    availableTimeEnd: '14:00',
    phone: '555-0123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-24',
    name: 'Dr. Daniel Wright',
    email: 'daniel@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Allergist',
    experience: 10,
    availableDays: ['Tue', 'Thu'],
    availableTimeStart: '09:00',
    availableTimeEnd: '16:00',
    phone: '555-0124',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-25',
    name: 'Dr. Ashley Scott',
    email: 'ashley@gowthamhospital.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Hematologist',
    experience: 14,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeStart: '08:00',
    availableTimeEnd: '16:00',
    phone: '555-0125',
    createdAt: new Date().toISOString(),
  }
];

const SEED_USERS: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@gowthamhospital.com',
    password: 'password',
    role: 'user',
    phone: '555-1234',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@gowthamhospital.com',
    password: 'password',
    role: 'user',
    phone: '555-5678',
    createdAt: new Date().toISOString(),
  }
];

// Helper to manage localStorage
const getStorage = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock Database Service Implementation
const mockDatabase: IDatabaseService = {
  getUsers: async (): Promise<User[]> => {
      return Promise.resolve(getStorage('db_users', [...SEED_USERS, SEED_ADMIN]));
  },
  getDoctors: async (): Promise<Doctor[]> => {
      return Promise.resolve(getStorage('db_doctors', SEED_DOCTORS));
  },
  getAppointments: async (): Promise<Appointment[]> => {
      return Promise.resolve(getStorage('db_appointments', []));
  },

  addUser: async (user: User) => {
    const users = getStorage('db_users', [...SEED_USERS, SEED_ADMIN]);
    users.push(user);
    setStorage('db_users', users);
    return Promise.resolve();
  },

  updateUser: async (updatedUser: User) => {
    const users = getStorage('db_users', [...SEED_USERS, SEED_ADMIN]).map(u => 
        u.id === updatedUser.id ? updatedUser : u
    );
    setStorage('db_users', users);
    return Promise.resolve();
  },

  addDoctor: async (doctor: Doctor) => {
    const docs = getStorage('db_doctors', SEED_DOCTORS);
    docs.push(doctor);
    setStorage('db_doctors', docs);
    return Promise.resolve();
  },

  updateDoctor: async (updatedDoctor: Doctor) => {
    const docs = getStorage('db_doctors', SEED_DOCTORS).map(doc => 
        doc.id === updatedDoctor.id ? updatedDoctor : doc
    );
    setStorage('db_doctors', docs);
    return Promise.resolve();
  },

  deleteDoctor: async (id: string) => {
    const docs = getStorage('db_doctors', SEED_DOCTORS).filter(d => d.id !== id);
    setStorage('db_doctors', docs);
    return Promise.resolve();
  },

  addAppointment: async (apt: Appointment) => {
    const apts = getStorage('db_appointments', []);
    apts.push(apt);
    setStorage('db_appointments', apts);
    return Promise.resolve();
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    const apts = getStorage('db_appointments', []).map(a => 
      a.id === id ? { ...a, status } : a
    );
    setStorage('db_appointments', apts);
    return Promise.resolve();
  },

  deleteUser: async (id: string) => {
      const users = getStorage('db_users', [...SEED_USERS, SEED_ADMIN]).filter(u => u.id !== id);
      setStorage('db_users', users);
      return Promise.resolve();
  },

  login: async (email: string, password: string): Promise<User | Doctor | null> => {
    const users = getStorage('db_users', [...SEED_USERS, SEED_ADMIN]);
    const doctors = getStorage('db_doctors', SEED_DOCTORS);
    const allUsers = [...users, ...doctors];
    const found = allUsers.find(u => u.email === email && u.password === password);
    return Promise.resolve(found || null);
  }
};

export const db = USE_BACKEND_API ? apiDatabase : mockDatabase;