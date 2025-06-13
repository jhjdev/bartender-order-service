export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  location: string;
  isActive: boolean;
}
