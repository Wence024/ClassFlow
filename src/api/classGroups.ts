import { api } from './axios';
import type { ClassGroup } from '../types/classSessions';

export const apiClassGroups = {
  async list(): Promise<ClassGroup[]> {
    const res = await api.get<ClassGroup[]>('/class-groups');
    return res.data;
  },
  async create(data: Omit<ClassGroup, 'id'>): Promise<ClassGroup> {
    const res = await api.post<ClassGroup>('/class-groups', data);
    return res.data;
  },
  async update(id: string, data: Partial<ClassGroup>): Promise<ClassGroup> {
    const res = await api.put<ClassGroup>(`/class-groups/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/class-groups/${id}`);
  },
};
