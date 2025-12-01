import { User, Doctor, Appointment, IDatabaseService } from '../types';

const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const handleRequest = async (request: Promise<Response>) => {
    try {
        const res = await request;
        return res;
    } catch (error) {
        console.error("API Request Failed:", error);
        throw new Error("Could not connect to the backend server. Please ensure Node.js server is running on port 5000 and MongoDB is connected.");
    }
};

export const apiDatabase: IDatabaseService = {
  getUsers: async (): Promise<User[]> => {
    const res = await handleRequest(fetch(`${API_URL}/users`, { headers: getHeaders() }));
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  getDoctors: async (): Promise<Doctor[]> => {
    const res = await handleRequest(fetch(`${API_URL}/doctors`, { headers: getHeaders() }));
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  },

  getAppointments: async (): Promise<Appointment[]> => {
    const res = await handleRequest(fetch(`${API_URL}/appointments`, { headers: getHeaders() }));
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  addUser: async (user: User) => {
    const res = await handleRequest(fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }));
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || 'Failed to add user');
    }
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('auth_token', data.token);
    }
  },

  updateUser: async (updatedUser: User) => {
    const res = await handleRequest(fetch(`${API_URL}/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedUser)
    }));
    if (!res.ok) throw new Error('Failed to update user');
  },

  addDoctor: async (doctor: Doctor) => {
    const res = await handleRequest(fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(doctor)
    }));
    if (!res.ok) throw new Error('Failed to add doctor');
  },

  updateDoctor: async (updatedDoctor: Doctor) => {
    const res = await handleRequest(fetch(`${API_URL}/doctors/${updatedDoctor.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedDoctor)
    }));
    if (!res.ok) throw new Error('Failed to update doctor');
  },

  deleteDoctor: async (id: string) => {
    const res = await handleRequest(fetch(`${API_URL}/doctors/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }));
    if (!res.ok) throw new Error('Failed to delete doctor');
  },

  addAppointment: async (apt: Appointment) => {
    const res = await handleRequest(fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(apt)
    }));
    if (!res.ok) throw new Error('Failed to add appointment');
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    const res = await handleRequest(fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
    }));
    if (!res.ok) throw new Error('Failed to update appointment status');
  },

  deleteUser: async (id: string) => {
    const res = await handleRequest(fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }));
    if (!res.ok) throw new Error('Failed to delete user');
  },

  login: async (email: string, password: string): Promise<User | Doctor | null> => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!res.ok) return null;
        
        const data = await res.json();
        if (data.token && data.user) {
            localStorage.setItem('auth_token', data.token);
            return data.user;
        }
        return null;
    } catch (error) {
        console.error("Login API Error:", error);
        throw new Error("Could not connect to the backend server.");
    }
  }
};
