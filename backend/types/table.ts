import { Order } from './order';

export interface TablePosition {
  x: number;
  y: number;
  rotation: number;
}

export interface TableDimensions {
  width: number;
  height: number;
}

export interface TableShape {
  type: 'rectangle' | 'circle' | 'custom';
  // For custom shapes, SVG path data
  path?: string;
}

export interface TableStatus {
  isOccupied: boolean;
  isReserved: boolean;
  currentOrderId?: string;
  serverAssigned?: string;  // Employee ID of assigned server
}

export interface Table {
  _id?: string;
  number: number;
  position: TablePosition;
  dimensions: TableDimensions;
  shape: TableShape;
  capacity: number;
  status: TableStatus;
  section?: string;  // Optional section/area identifier
}

export interface TableWithOrders extends Table {
  currentOrder?: Order;
  previousOrders?: Order[];
}

export interface TableLayout {
  _id?: string;
  name: string;
  tables: Table[];
  lastModified: string;
  isActive: boolean;
}

export interface TableSection {
  _id?: string;
  name: string;
  tables: number[];  // Array of table numbers in this section
  color?: string;    // Optional color for visual distinction
}
