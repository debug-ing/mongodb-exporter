import { MongoClient } from 'mongodb';
import { MONGO_URI } from '../config/mongo.config';

export const client: MongoClient = new MongoClient(MONGO_URI);
