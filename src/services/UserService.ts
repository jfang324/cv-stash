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
     * Creates a user that matches the id of the provided user, if that user doesn't exist it creates one
     * @param providedUser - A partial user, used to create an object if it doesn't exist already
     * @returns The user object matching the provided credentials
     */
    async createIfNewUser(providedUser: Partial<User>): Promise<User> {
        if (!providedUser || !providedUser.id || !providedUser.name || !providedUser.email) {
            throw new Error('UserService failed to retrieve user credentials')
        }

        const userCredentials = await this.users.getUserById(providedUser.id)

        if (!userCredentials) {
            try {
                const newUserCredentials = await this.users.createUser(
                    providedUser.id,
                    providedUser.name,
                    providedUser.email
                )

                return newUserCredentials
            } catch (error) {
                console.error(`Error creating new user:: ${error}`)
                throw new Error('UserService failed to create a new user')
            }
        }

        return userCredentials
    }
}
