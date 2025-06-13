import api from './axios';
import { Table } from '../types/table';

export const tableService = {
  getAllTables: () => api.get<Table[]>('/tables').then((res) => res.data),
  getTableById: (id: string) =>
    api.get<Table>(`/tables/${id}`).then((res) => res.data),
  createTable: (data: Omit<Table, '_id'>) =>
    api.post<Table>('/tables', data).then((res) => res.data),
  updateTable: (id: string, data: Partial<Table>) =>
    api.put<Table>(`/tables/${id}`, data).then((res) => res.data),
  deleteTable: (id: string) =>
    api.delete(`/tables/${id}`).then((res) => res.data),
};
