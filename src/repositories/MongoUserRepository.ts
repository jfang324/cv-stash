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
        },
        name: {
            type: String,
            required: [true, 'All users need a name'],
        },
        email: {
            type: String,
        },
    },
    { collection: 'Users' }
)

//factory function for retrieving the model
function UserModel(connection: mongoose.Connection) {
    return mongoose.models.User || connection.model<UserDocument>('User', userSchema)
}

//maps a a document to an object
function mapUserDocumentToUser(userDocument: UserDocument): User {
    if (!userDocument || !userDocument.id || !userDocument.name) {
        throw new Error('Invalid User Document')
    }

    return {
        id: userDocument.id,
        name: userDocument.name,
        email: userDocument?.email || '',
    }
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
     * Gets user by id
     * @param id - The auth0 id of the user
     * @returns The user object or null if they don't exist
     */
    async getUserById(id: string): Promise<User | null> {
        const userModel = UserModel(this.connection)

        try {
            const user = await userModel.findOne({ id: id })

            if (!user) {
                return null
            }

            return mapUserDocumentToUser(user)
        } catch (error) {
            throw new Error('UserRepository failed to retrieve user by ID')
        }
    }

    /**
     * Creates a user object in the database with the given credentials
     * @param id - The auth0 id of the user
     * @param name - The name of the user
     * @param email - The email of the user
     * @returns The user object that was created
     */
    async createUser(id: string, name: string, email: string): Promise<User> {
        const userModel = UserModel(this.connection)

        try {
            const user = await userModel.create({ id, name, email })

            return mapUserDocumentToUser(user)
        } catch (error) {
            throw new Error('UserRepository failed to create a new user')
        }
    }
}
