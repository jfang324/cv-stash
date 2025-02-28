import { S3Client } from '@aws-sdk/client-s3'

const BUCKET_REGION: string = process.env.BUCKET_REGION || ''
const ACCESS_KEY: string = process.env.ACCESS_KEY || ''
const SECRET_ACCESS_KEY: string = process.env.SECRET_ACCESS_KEY || ''

if (!BUCKET_REGION || !ACCESS_KEY || !SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials or bucket region is not set')
}

let cached = global.s3

if (!cached) {
    cached = global.s3 = { client: null }
}

/**
 * Create a S3 client if it doesn't exist
 */
const getS3Client = (): S3Client => {
    if (cached.client) {
        return cached.client
    }

    try {
        cached.client = new S3Client({
            region: BUCKET_REGION,
            credentials: {
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        })
    } catch (error) {
        console.error(`Failed to create S3 client: ${error}`)
        throw new Error('Failed to create S3 client')
    }

    return cached.client
}

export default getS3Client
