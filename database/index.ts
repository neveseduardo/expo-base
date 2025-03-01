import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { user } from './schema';

export const DATABASE_NAME = 'app.db';

const expoDb = openDatabaseSync(DATABASE_NAME);

export const db = drizzle(expoDb, { schema: { user } });