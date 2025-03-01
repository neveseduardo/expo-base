import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	cpf: text('cpf').unique().notNull(),
});

export type User = typeof user.$inferSelect;