import { api } from './axios';
import type { Instructor } from '../types/classSessions';

export const apiInstructors = {
  async list(): Promise<Instructor[]> {
    const res = await api.get<Instructor[]>('/schedule/instructors');
    return res.data;
  },
  async get(id: string): Promise<Instructor> {
    const res = await api.get<Instructor>(`/schedule/instructors/${id}`);
    return res.data;
  },
  async create(data: Omit<Instructor, 'id'>): Promise<Instructor> {
    const res = await api.post<Instructor>('/schedule/instructors', data);
    return res.data;
  },
  async update(id: string, data: Partial<Instructor>): Promise<Instructor> {
    const res = await api.put<Instructor>(`/schedule/instructors/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/schedule/instructors/${id}`);
  },
};
