import { api } from './axios';
import type { Classroom } from '../types/classSessions';

export const apiClassrooms = {
  async list(): Promise<Classroom[]> {
    const res = await api.get<Classroom[]>('/schedule/classrooms');
    return res.data;
  },
  async get(id: string): Promise<Classroom> {
    const res = await api.get<Classroom>(`/schedule/classrooms/${id}`);
    return res.data;
  },
  async create(data: Omit<Classroom, 'id'>): Promise<Classroom> {
    const res = await api.post<Classroom>('/schedule/classrooms', data);
    return res.data;
  },
  async update(id: string, data: Partial<Classroom>): Promise<Classroom> {
    const res = await api.put<Classroom>(`/schedule/classrooms/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/schedule/classrooms/${id}`);
  },
};
