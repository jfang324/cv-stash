import { User } from '@/interfaces/User'

export interface UserRepository {
    getUserById(id: string): Promise<User | null>
    createUser(id: string, name: string, email: string): Promise<User>
}
