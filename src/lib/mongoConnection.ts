import mongoose from 'mongoose'

const DATABASE_URL: string = process.env.DATABASE_URL || ''

if (DATABASE_URL === '') {
	throw new Error('DATABASE_URL is not set')
}

let cached = global.db

if (!cached) {
	cached = global.db = { connection: null }
}

/**
 * Create a connection to the database if it doesn't exist
 */
const connectToDb = async (): Promise<mongoose.Connection> => {
	if (cached.connection) {
		return cached.connection
	}

	try {
		cached.connection = await mongoose.connect(DATABASE_URL)
	} catch (error) {
		console.error(`Failed to connect to the database: ${error}`)
		throw new Error('Failed to connect to the database')
	}

	return cached.connection
}

export default connectToDb
