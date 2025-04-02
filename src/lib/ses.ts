import { SESClient } from '@aws-sdk/client-ses'

const SES_REGION: string = process.env.SES_REGION || ''
const ACCESS_KEY: string = process.env.ACCESS_KEY || ''
const SECRET_ACCESS_KEY: string = process.env.SECRET_ACCESS_KEY || ''

if (!SES_REGION || !ACCESS_KEY || !SECRET_ACCESS_KEY) {
	throw new Error('AWS credentials or SES region is not set')
}

let cached = global.ses

if (!cached) {
	cached = global.ses = { client: null }
}

/**
 * Create a SES client if it doesn't exist
 */
const getSESClient = (): SESClient => {
	if (cached.client) {
		return cached.client
	}

	try {
		cached.client = new SESClient({
			region: SES_REGION,
			credentials: {
				accessKeyId: ACCESS_KEY,
				secretAccessKey: SECRET_ACCESS_KEY
			}
		})
	} catch (error) {
		console.error(`Failed to create SES client: ${error}`)
		throw new Error('Failed to create SES client')
	}

	return cached.client
}

export default getSESClient
