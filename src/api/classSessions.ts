import { api } from './axios';
import type { ClassSession } from '../types/classSessions';

export const apiClassSessions = {
  async list(): Promise<ClassSession[]> {
    const res = await api.get<ClassSession[]>('/class-sessions');
    return res.data;
  },
  async get(id: string): Promise<ClassSession> {
    const res = await api.get<ClassSession>(`/class-sessions/${id}`);
    return res.data;
  },
  async create(data: Omit<ClassSession, 'id'>): Promise<ClassSession> {
    const res = await api.post<ClassSession>('/class-sessions', data);
    return res.data;
  },
  async update(id: string, data: Partial<ClassSession>): Promise<ClassSession> {
    const res = await api.put<ClassSession>(`/class-sessions/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/class-sessions/${id}`);
  },
};
