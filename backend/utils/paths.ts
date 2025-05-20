import * as path from 'path';

export const getRootPath = () => process.cwd();
export const getEnvPath = () => path.resolve(getRootPath(), '.env');
export const getUploadsPath = () => path.resolve(getRootPath(), 'uploads');
