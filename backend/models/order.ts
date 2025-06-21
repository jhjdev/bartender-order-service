import { ObjectId } from 'mongodb';

export interface OrderNote {
  _id?: ObjectId;
  text: string;
  author: string;
  timestamp: Date;
  category: 'allergy' | 'special_request' | 'general';
}

export interface OrderItem {
  _id?: ObjectId;
  drinkId: ObjectId;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  _id?: ObjectId;
  customerNumber: string;
  tableNumber?: string;
  staffId?: ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'split';
  notes: OrderNote[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CreateOrderRequest {
  customerNumber: string;
  tableNumber?: string;
  staffId?: string;
  items: {
    drinkId: string;
    quantity: number;
    notes?: string;
  }[];
  notes?: Omit<OrderNote, 'timestamp'>[];
}

export interface UpdateOrderRequest {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  paymentMethod?: Order['paymentMethod'];
  notes?: Omit<OrderNote, 'timestamp'>[];
}
