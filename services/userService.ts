import { and, eq, like } from 'drizzle-orm';
import { db } from '../database';
import { type User, user as userSchema } from '../database/schema';

export const userService = {
	getUsers: (filters: Partial<Omit<User, 'id'>>) => {
		const conditions = [];

		if (filters.name) {
			conditions.push(like(userSchema.name, `%${filters.name}%`));
		}

		if (filters.email) {
			conditions.push(eq(userSchema.email, filters.email));
		}

		if (filters.cpf) {
			conditions.push(eq(userSchema.cpf, filters.cpf));
		}

		return db.query.user.findMany({
			where: conditions.length > 0 ? and(...conditions) : undefined,
		});
	},
	getUser: (userId: number) => {
		return db.query.user.findFirst({
			where: eq(userSchema.id, userId),
		});
	},
	addUser: async (user: Omit<User, 'id'>) => {
		return db.insert(userSchema).values(user);
	},
	updateUser: async (user: Omit<User, 'id'>, userId: number) => {
		return db.update(userSchema).set(user).where(eq(userSchema.id, userId));
	},
	deleteUser: async (userId: number) => {
		return db.delete(userSchema).where(eq(userSchema.id, userId));
	},
};