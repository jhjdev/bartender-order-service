export interface OrderNote {
  _id?: string;
  text: string;
  author: string;
  timestamp: string; // ISO date string
  category: 'allergy' | 'special_request' | 'general';
}

export interface OrderItem {
  _id?: string;
  drinkId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  _id?: string;
  customerNumber: string;
  tableNumber?: string;
  staffId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes: OrderNote[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  completedAt?: string; // ISO date string
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

export type PaymentMethod = 'cash' | 'card' | 'split';

// Request/Response types for API calls
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
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: Omit<OrderNote, 'timestamp'>[];
}
