import { ResumeRepository } from '@/interfaces/ResumeRepository'
import type { Resume } from '@/types/Resume'
import mongoose, { Schema } from 'mongoose'

//define an interface for a mongoose document representing a Resume
interface ResumeDocument extends Resume, mongoose.Document {
	_id: mongoose.Types.ObjectId
	id: string
	ownerId: string
}

//define the mongoose schema
const resumeSchema: Schema<ResumeDocument> = new Schema(
	{
		id: {
			type: String,
			required: [true, 'All resumes need to have an ID'],
			unique: [true, 'Resume ID must be unique']
		},
		name: {
			type: String,
			required: [true, 'All resumes need a name']
		},
		textContent: {
			type: String,
			required: [true, 'All resumes need some text content']
		},
		ownerId: {
			type: String,
			required: [true, 'All resumes need an owner Id']
		},
		lastModified: {
			type: Number,
			required: [true, 'All resumes need a last modified date']
		}
	},
	{
		toObject: {
			transform: (doc, ret) => {
				delete ret._id
				delete ret.__v
				delete ret.ownerId

				return ret
			}
		},
		collection: 'Resumes'
	}
)

//When a resume is deleted, also delete all associated job applications
resumeSchema.post('findOneAndDelete', async function (doc) {
	if (doc && mongoose.models.JobApplication) {
		await mongoose.models.JobApplication.deleteMany({ resume: doc.id })
	}
})

//factory function for retrieving the model
function ResumeModel(connection: mongoose.Connection) {
	return mongoose.models.Resume || connection.model<ResumeDocument>('Resume', resumeSchema)
}

//ResumeRepository implemented with mongoose
export class MongoResumeRepository implements ResumeRepository {
	private connection: mongoose.Connection

	constructor(connection: mongoose.Connection) {
		if (!connection) {
			throw new Error('No connection to the database')
		}

		this.connection = connection
	}

	/**
	 * Creates a resume in the database
	 * @param ownerId - The id of the user/owner of the resume
	 * @param resume - The resume object to create
	 * @returns
	 */
	async createResume(ownerId: string, resume: Resume): Promise<Resume> {
		const resumeModel = ResumeModel(this.connection)

		try {
			const newResume = (await resumeModel.create({ ...resume, ownerId })).toObject()

			return newResume
		} catch (error) {
			console.error(`ResumeRepository failed to create a new resume: ${error}`)
			throw new Error('ResumeRepository failed to create a new resume')
		}
	}

	/**
	 * Gets a resume by id
	 * @param id - The id of the resume
	 * @returns The resume object or null if it doesn't exist
	 */
	async getResumeById(id: string): Promise<Resume | null> {
		const resumeModel = ResumeModel(this.connection)

		try {
			const resume = await resumeModel.findOne({ id }).lean<Resume>().select('-_id -__v -ownerId')

			return resume || null
		} catch (error) {
			console.error(`ResumeRepository failed to retrieve a resume by id: ${error}`)
			throw new Error('ResumeRepository failed to retrieve a resume by id')
		}
	}

	/**
	 * Gets resumes with the associated ownerId
	 * @param ownerId - The id of the user
	 * @returns An array of resumes that belong to the user
	 */
	async getResumesByOwnerId(ownerId: string): Promise<Resume[]> {
		const resumeModel = ResumeModel(this.connection)

		try {
			const resumes = await resumeModel.find({ ownerId }).lean<Resume[]>().select('-_id -__v -ownerId')

			return resumes
		} catch (error) {
			console.error(`ResumeRepository failed to retrieve resumes by owner ID: ${error}`)
			throw new Error('ResumeRepository failed to retrieve resumes by owner ID')
		}
	}

	/**
	 * Gets the ownerId of a resume
	 * @param resume - The resume object
	 * @returns The ownerId of the resume
	 */
	async getOwnerId(resume: Resume): Promise<string> {
		const resumeModel = ResumeModel(this.connection)

		try {
			const resumeDocument = await resumeModel.findOne({ id: resume.id }).select('-_id -__v')

			return resumeDocument.ownerId
		} catch (error) {
			console.error(`ResumeRepository failed to retrieve ownerId: ${error}`)
			throw new Error('ResumeRepository failed to retrieve ownerId')
		}
	}

	/**
	 * Deletes a resume by id
	 * @param id - The id of the resume to delete
	 * @returns The deleted resume object
	 */
	async deleteResumeById(id: string): Promise<Resume> {
		const resumeModel = ResumeModel(this.connection)

		try {
			const deletedResume = await resumeModel.findOneAndDelete({ id }).select('-_id -__v -ownerId')

			return deletedResume
		} catch (error) {
			console.error(`ResumeRepository failed to delete resume by id: ${error}`)
			throw new Error('ResumeRepository failed to delete resume by id')
		}
	}
}
