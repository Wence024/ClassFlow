// NOTE: Make sure to install axios: npm install axios
import axios, { type AxiosResponse } from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// --- Courses ---
export const apiCourses = {
  list: () => api.get('/courses').then((res: AxiosResponse) => res.data),
  create: (data: any) => api.post('/courses', data).then((res: AxiosResponse) => res.data),
  update: (id: string, data: any) =>
    api.put(`/courses/${id}`, data).then((res: AxiosResponse) => res.data),
  delete: (id: string) => api.delete(`/courses/${id}`).then((res: AxiosResponse) => res.data),
};

// --- Class Groups ---
export const apiClassGroups = {
  list: () => api.get('/class-groups').then((res: AxiosResponse) => res.data),
  create: (data: any) => api.post('/class-groups', data).then((res: AxiosResponse) => res.data),
  update: (id: string, data: any) =>
    api.put(`/class-groups/${id}`, data).then((res: AxiosResponse) => res.data),
  delete: (id: string) => api.delete(`/class-groups/${id}`).then((res: AxiosResponse) => res.data),
};

// --- Classrooms ---
export const apiClassrooms = {
  list: () => api.get('/classrooms').then((res: AxiosResponse) => res.data),
  create: (data: any) => api.post('/classrooms', data).then((res: AxiosResponse) => res.data),
  update: (id: string, data: any) =>
    api.put(`/classrooms/${id}`, data).then((res: AxiosResponse) => res.data),
  delete: (id: string) => api.delete(`/classrooms/${id}`).then((res: AxiosResponse) => res.data),
};

// --- Instructors ---
export const apiInstructors = {
  list: () => api.get('/instructors').then((res: AxiosResponse) => res.data),
  create: (data: any) => api.post('/instructors', data).then((res: AxiosResponse) => res.data),
  update: (id: string, data: any) =>
    api.put(`/instructors/${id}`, data).then((res: AxiosResponse) => res.data),
  delete: (id: string) => api.delete(`/instructors/${id}`).then((res: AxiosResponse) => res.data),
};

// --- Class Sessions ---
export const apiClassSessions = {
  list: () => api.get('/class-sessions').then((res: AxiosResponse) => res.data),
  create: (data: any) => api.post('/class-sessions', data).then((res: AxiosResponse) => res.data),
  update: (id: string, data: any) =>
    api.put(`/class-sessions/${id}`, data).then((res: AxiosResponse) => res.data),
  delete: (id: string) =>
    api.delete(`/class-sessions/${id}`).then((res: AxiosResponse) => res.data),
};
