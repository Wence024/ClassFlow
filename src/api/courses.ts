import { api } from './axios';
import type { Course } from '../types/classSessions';

export const apiCourses = {
  async list(): Promise<Course[]> {
    const res = await api.get<Course[]>('/courses');
    return res.data;
  },
  async create(data: Omit<Course, 'id'>): Promise<Course> {
    const res = await api.post<Course>('/courses', data);
    return res.data;
  },
  async update(id: string, data: Partial<Course>): Promise<Course> {
    const res = await api.put<Course>(`/courses/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },
};
