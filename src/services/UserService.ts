import { User } from '@/interfaces/User'
import { UserRepository } from '@/interfaces/UserRepository'

export class UserService {
    private users: UserRepository

    constructor(userRepository: UserRepository) {
        if (!userRepository) {
            throw new Error('No UserRepository provided to UserService')
        }

        this.users = userRepository
    }

    /**
     * Create a new user if they don't exist, otherwise return the existing user
     * @param user - The user object to create or retrieve
     * @returns The created or retrieved user object
     */
    async createIfNewUser(user: User): Promise<User> {
        const userMetadata = await this.users.getUserById(user.id)

        if (!userMetadata) {
            try {
                const newUserMetadata = await this.users.createUser(user)

                return newUserMetadata
            } catch (error) {
                console.error(`UserService failed to create a new user: ${error}`)
                throw new Error('UserService failed to create a new user')
            }
        }

        return userMetadata
    }

    /**
     * Update a user in the database
     * @param id - The ID of the user to update
     * @param updatedFields - The updated fields of the user
     * @returns The updated user object
     */
    async updateUser(id: string, updatedFields: Partial<User>): Promise<User> {
        try {
            const updatedUser = await this.users.updateUserById(id, updatedFields)

            return updatedUser
        } catch (error) {
            console.error(`UserService failed to update user: ${error}`)
            throw new Error('UserService failed to update user')
        }
    }
}
