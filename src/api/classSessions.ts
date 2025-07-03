import { api } from './axios';
import type { ClassSession } from '../types/classSessions';

export const apiClassSessions = {
  async list(): Promise<ClassSession[]> {
    const res = await api.get<ClassSession[]>('/schedule/class-sessions');
    return res.data;
  },
  async get(id: string): Promise<ClassSession> {
    const res = await api.get<ClassSession>(`/schedule/class-sessions/${id}`);
    return res.data;
  },
  async create(data: Omit<ClassSession, 'id'>): Promise<ClassSession> {
    const res = await api.post<ClassSession>('/schedule/class-sessions', data);
    return res.data;
  },
  async update(id: string, data: Partial<ClassSession>): Promise<ClassSession> {
    const res = await api.put<ClassSession>(`/schedule/class-sessions/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/schedule/class-sessions/${id}`);
  },
};
