import { ObjectId } from 'mongodb';

// Base interface for all MongoDB documents
export interface BaseDocument {
  _id: ObjectId;
}

// Type for documents being sent to/from the client with string IDs
export interface BaseDocumentWithStringId {
  _id: string;
}

// Helper functions for working with ObjectId
export const toObjectId = (id: string | ObjectId): ObjectId => {
  return typeof id === 'string' ? new ObjectId(id) : id;
};

export const toString = (id: ObjectId | string): string => {
  return typeof id === 'string' ? id : id.toString();
};

// Type guard to check if a value is an ObjectId
export const isObjectId = (value: any): value is ObjectId => {
  return value instanceof ObjectId;
};

// Utility function to convert MongoDB documents for API responses
export const convertToApiResponse = <T extends BaseDocument>(doc: T): Omit<T, '_id'> & BaseDocumentWithStringId => {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id.toString()
  } as Omit<T, '_id'> & BaseDocumentWithStringId;
};

// Utility function to convert arrays of MongoDB documents for API responses
export const convertArrayToApiResponse = <T extends BaseDocument>(docs: T[]): (Omit<T, '_id'> & BaseDocumentWithStringId)[] => {
  return docs.map(convertToApiResponse);
};

