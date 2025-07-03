import { api } from './axios';
import type { ClassGroup } from '../types/classSessions';

export const apiClassGroups = {
  async list(): Promise<ClassGroup[]> {
    const res = await api.get<ClassGroup[]>('/schedule/class-groups');
    return res.data;
  },
  async get(id: string): Promise<ClassGroup> {
    const res = await api.get<ClassGroup>(`/schedule/class-groups/${id}`);
    return res.data;
  },
  async create(data: Omit<ClassGroup, 'id'>): Promise<ClassGroup> {
    const res = await api.post<ClassGroup>('/schedule/class-groups', data);
    return res.data;
  },
  async update(id: string, data: Partial<ClassGroup>): Promise<ClassGroup> {
    const res = await api.put<ClassGroup>(`/schedule/class-groups/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/schedule/class-groups/${id}`);
  },
};
