export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  _id?: string;
  drinkId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: OrderStatus;
}

export interface Order {
  _id?: string;
  tableNumber: number;
  customerNumber?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: string;    // ISO date string
  updatedAt: string;    // ISO date string
  servedBy?: string;    // Employee ID
  notes?: string;
}

export interface OrderSummary {
  _id: string;
  tableNumber: number;
  customerNumber?: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: string;
}

