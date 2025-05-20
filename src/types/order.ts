export interface Order {
  _id?: string;
  tableNumber: number;
  customerNumber?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  servedBy?: string; // Employee ID
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'cancelled';
