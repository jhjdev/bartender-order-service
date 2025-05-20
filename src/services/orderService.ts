import axios from '../config/axios';
import { Order } from '../types/order';

const API_URL = '/orders';

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const response = await axios.post(API_URL, order);
    return response.data;
  },

  async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
    const response = await axios.put(`${API_URL}/${id}`, order);
    return response.data;
  },

  async deleteOrder(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
