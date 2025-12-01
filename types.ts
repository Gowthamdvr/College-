export type Role = 'user' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In real app, never store plain text
  role: Role;
  phone?: string;
  createdAt: string;
}

export interface Doctor extends User {
  specialization: string;
  experience: number;
  availableDays: string[]; // e.g. ["Mon", "Wed"]
  availableTimeStart: string; // "09:00"
  availableTimeEnd: string; // "17:00"
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AuthState {
  user: User | Doctor | null;
  isAuthenticated: boolean;
}

export interface IDatabaseService {
    getUsers: () => Promise<User[]>;
    getDoctors: () => Promise<Doctor[]>;
    getAppointments: () => Promise<Appointment[]>;
    addUser: (user: User) => Promise<void>;
    updateUser: (updatedUser: User) => Promise<void>;
    addDoctor: (doctor: Doctor) => Promise<void>;
    updateDoctor: (updatedDoctor: Doctor) => Promise<void>;
    deleteDoctor: (id: string) => Promise<void>;
    addAppointment: (apt: Appointment) => Promise<void>;
    updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    login: (email: string, password: string) => Promise<User | Doctor | null>;
}
