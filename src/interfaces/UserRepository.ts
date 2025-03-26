import type { User } from '@/types/User'

export interface UserRepository {
	createUser(user: User): Promise<User>
	getUserById(id: string): Promise<User | null>
	updateUserById(id: string, updatedFields: Partial<User>): Promise<User>
}
