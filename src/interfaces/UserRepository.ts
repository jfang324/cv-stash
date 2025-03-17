import { User } from '@/interfaces/User'

export interface UserRepository {
    getUserById(id: string): Promise<User | null>
    createUser(user: User): Promise<User>
    updateUserById(id: string, updatedFields: Partial<User>): Promise<User>
}
