import 'dotenv/config';

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

export const COLLECTION_NAME = process.env.COLLECTION_NAME || 'test';