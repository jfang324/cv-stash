import { User } from '@/interfaces/User'
import { UserRepository } from '@/interfaces/UserRepository'
import mongoose, { Schema } from 'mongoose'

//define an interface for a mongoose document representing a User
interface UserDocument extends User, mongoose.Document {
    _id: mongoose.Types.ObjectId
    id: string
}

//define the mongoose schema
const userSchema: Schema<UserDocument> = new Schema(
    {
        id: {
            type: String,
            required: [true, 'All users need to have an ID'],
            unique: [true, 'User ID must be unique'],
        },
        profilePicture: {
            type: String,
            required: [true, 'All users need a profile picture'],
        },
        firstName: {
            type: String,
            required: [true, 'All users need a first name'],
        },
        lastName: {
            type: String,
            required: [true, 'All users need a last name'],
        },
        email: {
            type: String,
            required: [true, 'All users need an email'],
        },
        notifications: {
            type: Boolean,
            default: true,
        },
    },
    { collection: 'Users' }
)

//factory function for retrieving the model
function UserModel(connection: mongoose.Connection) {
    return mongoose.models.User || connection.model<UserDocument>('User', userSchema)
}

//UserRepository implemented with mongoose
export class MongoUserRepository implements UserRepository {
    private connection: mongoose.Connection

    constructor(connection: mongoose.Connection) {
        if (!connection) {
            throw new Error('No connection to the database')
        }

        this.connection = connection
    }

    /**
     * Retrieves a user by their ID
     * @param id - The ID of the user to retrieve
     * @returns The user object matching the provided ID, or null if no user is found
     */
    async getUserById(id: string): Promise<User | null> {
        const userModel = UserModel(this.connection)

        try {
            const user = await userModel.findOne({ id }).lean<User>().select('-_id -__v')

            return user || null
        } catch (error) {
            console.error(`UserRepository failed to retrieve user by ID: ${error}`)
            throw new Error('UserRepository failed to retrieve user by ID')
        }
    }

    /**
     * Creates a new user in the database
     * @param user - The user object to create
     * @returns The created user object
     */
    async createUser(user: User): Promise<User> {
        const userModel = UserModel(this.connection)

        try {
            const newUser = (await userModel.create(user)).toObject({
                select: ['-_id -__v'],
            })

            return newUser
        } catch (error) {
            console.error(`UserRepository failed to create a new user: ${error}`)
            throw new Error('UserRepository failed to create a new user')
        }
    }

    /**
     * Updates a user in the database
     * @param id - The ID of the user to update
     * @param updatedFields - The updated fields of the user
     * @returns The updated user object
     */
    async updateUserById(id: string, updatedFields: Partial<User>): Promise<User> {
        const userModel = UserModel(this.connection)

        try {
            const updatedUser = await userModel
                .findOneAndUpdate(
                    { id: id },
                    {
                        $set: {
                            ...updatedFields,
                        },
                    },
                    { new: true, runValidators: true }
                )
                .lean<User>()
                .select('-_id -__v')

            if (!updatedUser) {
                throw new Error('User not found')
            }

            return updatedUser
        } catch (error) {
            console.error(`UserRepository failed to update user: ${error}`)
            throw new Error('UserRepository failed to update user')
        }
    }
}
