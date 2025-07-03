// NOTE: Make sure to install axios: npm install axios
import axios, { type AxiosResponse } from 'axios';
import type {
  Course,
  ClassGroup,
  Classroom,
  Instructor,
  ClassSession,
} from '../types/classSessions';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// --- Courses ---
export const apiCourses = {
  async list(): Promise<Course[]> {
    const res: AxiosResponse<Course[]> = await api.get('/courses');
    return res.data;
  },
  async create(data: Omit<Course, 'id'>): Promise<Course> {
    const res: AxiosResponse<Course> = await api.post('/courses', data);
    return res.data;
  },
  async update(id: string, data: Partial<Course>): Promise<Course> {
    const res: AxiosResponse<Course> = await api.put(`/courses/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },
};

// --- Class Groups ---
export const apiClassGroups = {
  async list(): Promise<ClassGroup[]> {
    const res: AxiosResponse<ClassGroup[]> = await api.get('/class-groups');
    return res.data;
  },
  async create(data: Omit<ClassGroup, 'id'>): Promise<ClassGroup> {
    const res: AxiosResponse<ClassGroup> = await api.post('/class-groups', data);
    return res.data;
  },
  async update(id: string, data: Partial<ClassGroup>): Promise<ClassGroup> {
    const res: AxiosResponse<ClassGroup> = await api.put(`/class-groups/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/class-groups/${id}`);
  },
};

// --- Classrooms ---
export const apiClassrooms = {
  async list(): Promise<Classroom[]> {
    const res: AxiosResponse<Classroom[]> = await api.get('/classrooms');
    return res.data;
  },
  async create(data: Omit<Classroom, 'id'>): Promise<Classroom> {
    const res: AxiosResponse<Classroom> = await api.post('/classrooms', data);
    return res.data;
  },
  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    const res: AxiosResponse<Classroom> = await api.put(`/classrooms/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/classrooms/${id}`);
  },
};

// --- Instructors ---
export const apiInstructors = {
  async list(): Promise<Instructor[]> {
    const res: AxiosResponse<Instructor[]> = await api.get('/instructors');
    return res.data;
  },
  async create(data: Omit<Instructor, 'id'>): Promise<Instructor> {
    const res: AxiosResponse<Instructor> = await api.post('/instructors', data);
    return res.data;
  },
  async update(id: string, data: Partial<Instructor>): Promise<Instructor> {
    const res: AxiosResponse<Instructor> = await api.put(`/instructors/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/instructors/${id}`);
  },
};

// --- Class Sessions ---
export const apiClassSessions = {
  async list(): Promise<ClassSession[]> {
    const res: AxiosResponse<ClassSession[]> = await api.get('/class-sessions');
    return res.data;
  },
  async create(data: Omit<ClassSession, 'id'>): Promise<ClassSession> {
    const res: AxiosResponse<ClassSession> = await api.post('/class-sessions', data);
    return res.data;
  },
  async update(id: string, data: Partial<ClassSession>): Promise<ClassSession> {
    const res: AxiosResponse<ClassSession> = await api.put(`/class-sessions/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/class-sessions/${id}`);
  },
};
