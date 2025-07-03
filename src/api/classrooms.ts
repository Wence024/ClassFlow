import { api } from './axios';
import type { Classroom } from '../types/classSessions';

export const apiClassrooms = {
  async list(): Promise<Classroom[]> {
    const res = await api.get<Classroom[]>('/classrooms');
    return res.data;
  },
  async get(id: string): Promise<Classroom> {
    const res = await api.get<Classroom>(`/classrooms/${id}`);
    return res.data;
  },
  async create(data: Omit<Classroom, 'id'>): Promise<Classroom> {
    const res = await api.post<Classroom>('/classrooms', data);
    return res.data;
  },
  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    const res = await api.put<Classroom>(`/classrooms/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/classrooms/${id}`);
  },
};
