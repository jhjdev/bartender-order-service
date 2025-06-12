export type FileType =
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export interface FileMetadata {
  _id?: string;
  originalName: string;
  fileName: string; // Name stored in the system
  fileType: FileType;
  description?: string;
  uploadedAt: string; // ISO date string
  size: number; // File size in bytes
  uploadedBy?: string; // User ID who uploaded the file
  path: string; // Storage path
}
