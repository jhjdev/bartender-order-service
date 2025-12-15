import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../config/axios';
import { AxiosError } from 'axios';
import { Order, OrderItem } from '../../types/order';

// Helper utility to calculate order total
export const calculateOrderTotal = (order: Partial<Order>): number => {
  if (!order.items || order.items.length === 0) return 0;

  return order.items.reduce((total: number, item: OrderItem) => {
    return total + item.price * item.quantity;
  }, 0);
};

// Define operation types for better tracking
export type OrderOperation =
  | 'fetch'
  | 'create'
  | 'update'
  | 'payment'
  | 'delete'
  | 'addItem'
  | 'none';

// Define error interface for better error context
interface OrderError {
  message: string;
  operation: OrderOperation;
  id?: string;
  timestamp: number;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loadingStates: {
    [key in OrderOperation]?: boolean;
  };
  errors: OrderError[];
  lastOperation: {
    type: OrderOperation;
    id?: string;
    timestamp: number;
    success?: boolean;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loadingStates: {},
  errors: [],
  lastOperation: {
    type: 'none',
    timestamp: Date.now(),
  },
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ orders: Order[] }>('/orders');
      return response.data.orders;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch orders'
        );
      }
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Order>('/orders', orderData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to create order'
        );
      }
      return rejectWithValue('Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (
    { orderId, updates }: { orderId: string; updates: Partial<Order> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<Order>(`/orders/${orderId}`, updates);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to update order'
        );
      }
      return rejectWithValue('Failed to update order');
    }
  }
);

export const processOrderPayment = createAsyncThunk(
  'orders/processOrderPayment',
  async (
    { orderId, isPaid = true }: { orderId: string; isPaid?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<Order>(`/orders/${orderId}/payment`, {
        isPaid,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to process payment'
        );
      }
      return rejectWithValue('Failed to process payment');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/orders/${orderId}`);
      return orderId;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to delete order'
        );
      }
      return rejectWithValue('Failed to delete order');
    }
  }
);

export const addItemToOrder = createAsyncThunk(
  'orders/addItemToOrder',
  async (
    {
      orderId,
      item,
    }: {
      orderId: string;
      item: {
        name: string;
        price: number;
        quantity: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<Order>(
        `/orders/${orderId}/items`,
        item
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to add item to order'
        );
      }
      return rejectWithValue('Failed to add item to order');
    }
  }
);

// Helper function to create an error object
export const createOrderError = (
  message: string,
  operation: OrderOperation,
  id?: string
): OrderError => ({
  message,
  operation,
  id,
  timestamp: Date.now(),
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setOrderError: (state, action: PayloadAction<OrderError>) => {
      state.errors.push(action.payload);
    },
    clearOrderErrors: (state) => {
      state.errors = [];
    },
    clearOperationErrors: (state, action: PayloadAction<OrderOperation>) => {
      state.errors = state.errors.filter(
        (error) => error.operation !== action.payload
      );
    },
    // Helper to clear errors for a specific operation on a specific order
    clearOrderOperationErrors: (
      state,
      action: PayloadAction<{ operation: OrderOperation; orderId: string }>
    ) => {
      const { operation, orderId } = action.payload;
      state.errors = state.errors.filter(
        (error) => !(error.operation === operation && error.id === orderId)
      );
    },
    togglePaymentStatus: (state, action: PayloadAction<string>) => {
      // Find the order by ID
      const orderToUpdate = state.orders.find(
        (order) => order._id === action.payload
      );
      if (orderToUpdate) {
        // Toggle the payment status (legacy boolean field)
        const nextIsPaid = !(orderToUpdate.isPaid ?? false);
        orderToUpdate.isPaid = nextIsPaid;

        // If the current order is being updated, update it too
        if (state.currentOrder && state.currentOrder._id === action.payload) {
          state.currentOrder.isPaid = nextIsPaid;
        }

        // Record last operation
        state.lastOperation = {
          type: 'payment',
          id: action.payload,
          timestamp: Date.now(),
          success: true,
        };
      }
    },
    // Set loading state for an operation
    setLoadingState: (
      state,
      action: PayloadAction<{ operation: OrderOperation; isLoading: boolean }>
    ) => {
      const { operation, isLoading } = action.payload;
      state.loadingStates[operation] = isLoading;
    },
    // Record operation success
    recordOperationSuccess: (
      state,
      action: PayloadAction<{ operation: OrderOperation; id?: string }>
    ) => {
      const { operation, id } = action.payload;
      state.lastOperation = {
        type: operation,
        id,
        timestamp: Date.now(),
        success: true,
      };
    },
    // Record operation failure
    recordOperationFailure: (
      state,
      action: PayloadAction<{
        operation: OrderOperation;
        id?: string;
        error: string;
      }>
    ) => {
      const { operation, id, error } = action.payload;
      state.errors.push({
        message: error,
        operation,
        id,
        timestamp: Date.now(),
      });
      state.lastOperation = {
        type: operation,
        id,
        timestamp: Date.now(),
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loadingStates['fetch'] = true;
        // Clear any previous fetch errors
        state.errors = state.errors.filter(
          (error) => error.operation !== 'fetch'
        );
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loadingStates['fetch'] = false;
        state.orders = action.payload;
        state.lastOperation = {
          type: 'fetch',
          timestamp: Date.now(),
          success: true,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loadingStates['fetch'] = false;
        state.errors.push({
          message: action.payload as string,
          operation: 'fetch',
          timestamp: Date.now(),
        });
        state.lastOperation = {
          type: 'fetch',
          timestamp: Date.now(),
          success: false,
        };
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loadingStates['create'] = true;
        // Clear any previous create errors
        state.errors = state.errors.filter(
          (error) => error.operation !== 'create'
        );
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loadingStates['create'] = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
        state.lastOperation = {
          type: 'create',
          id: action.payload._id,
          timestamp: Date.now(),
          success: true,
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loadingStates['create'] = false;
        state.errors.push({
          message: action.payload as string,
          operation: 'create',
          timestamp: Date.now(),
        });
        state.lastOperation = {
          type: 'create',
          timestamp: Date.now(),
          success: false,
        };
      })
      // Update Order
      .addCase(updateOrder.pending, (state, action) => {
        state.loadingStates['update'] = true;
        // Clear any previous update errors for this order (if we know the ID)
        const orderId = action.meta.arg.orderId;
        if (orderId) {
          state.errors = state.errors.filter(
            (error) => !(error.operation === 'update' && error.id === orderId)
          );
        }
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loadingStates['update'] = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
        state.lastOperation = {
          type: 'update',
          id: action.payload._id,
          timestamp: Date.now(),
          success: true,
        };
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loadingStates['update'] = false;
        // Extract orderId from the original action
        const orderId = action.meta.arg.orderId;
        state.errors.push({
          message: action.payload as string,
          operation: 'update',
          id: orderId,
          timestamp: Date.now(),
        });
        state.lastOperation = {
          type: 'update',
          id: orderId,
          timestamp: Date.now(),
          success: false,
        };
      })
      // Process Order Payment
      .addCase(processOrderPayment.pending, (state, action) => {
        state.loadingStates['payment'] = true;
        // Clear any previous payment errors for this order
        const orderId = action.meta.arg.orderId;
        state.errors = state.errors.filter(
          (error) => !(error.operation === 'payment' && error.id === orderId)
        );
      })
      .addCase(processOrderPayment.fulfilled, (state, action) => {
        state.loadingStates['payment'] = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
        state.lastOperation = {
          type: 'payment',
          id: action.payload._id,
          timestamp: Date.now(),
          success: true,
        };
      })
      .addCase(processOrderPayment.rejected, (state, action) => {
        state.loadingStates['payment'] = false;
        // Extract orderId from the original action
        const orderId = action.meta.arg.orderId;
        state.errors.push({
          message: action.payload as string,
          operation: 'payment',
          id: orderId,
          timestamp: Date.now(),
        });
        state.lastOperation = {
          type: 'payment',
          id: orderId,
          timestamp: Date.now(),
          success: false,
        };
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state, action) => {
        state.loadingStates['delete'] = true;
        // Clear any previous delete errors for this order
        const orderId = action.meta.arg;
        state.errors = state.errors.filter(
          (error) => !(error.operation === 'delete' && error.id === orderId)
        );
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loadingStates['delete'] = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
        if (state.currentOrder?._id === action.payload) {
          state.currentOrder = null;
        }
        state.lastOperation = {
          type: 'delete',
          id: action.payload,
          timestamp: Date.now(),
          success: true,
        };
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loadingStates['delete'] = false;
        // Extract orderId from the original action
        const orderId = action.meta.arg;
        state.errors.push({
          message: action.payload as string,
          operation: 'delete',
          id: orderId,
          timestamp: Date.now(),
        });
        state.lastOperation = {
          type: 'delete',
          id: orderId,
          timestamp: Date.now(),
          success: false,
        };
      })
      // Add Item To Order
      .addCase(addItemToOrder.pending, (state, action) => {
        state.loadingStates['addItem'] = true;
        // Clear any previous addItem errors for this order
        const orderId = action.meta.arg.orderId;
        state.errors = state.errors.filter(
          (error) => !(error.operation === 'addItem' && error.id === orderId)
        );
      })
      .addCase(addItemToOrder.fulfilled, (state, action) => {
        state.loadingStates['addItem'] = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
        state.lastOperation = {
          type: 'addItem',
          id: action.payload._id,
          timestamp: Date.now(),
          success: true,
        };
      })
      .addCase(addItemToOrder.rejected, (state, action) => {
        state.loadingStates['addItem'] = false;
        // Extract orderId from the original action
        const orderId = action.meta.arg.orderId;
        state.errors.push({
          message: action.payload as string,
          operation: 'addItem',
          id: orderId,
          timestamp: Date.now(),
        });
        state.lastOperation = {
          type: 'addItem',
          id: orderId,
          timestamp: Date.now(),
          success: false,
        };
      });
  },
});

export const {
  clearCurrentOrder,
  setOrderError,
  clearOrderErrors,
  clearOperationErrors,
  clearOrderOperationErrors,
  togglePaymentStatus,
  setLoadingState,
  recordOperationSuccess,
  recordOperationFailure,
} = orderSlice.actions;
export default orderSlice.reducer;
