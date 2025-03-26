import { JobApplicationRepository } from '@/interfaces/JobApplicationRepository'
import type { JobApplication } from '@/types/JobApplication'
import mongoose, { Schema } from 'mongoose'

//define an interface for a mongoose document representing a JobApplication
interface JobApplicationDocument extends JobApplication, mongoose.Document {
	_id: mongoose.Types.ObjectId
	id: string
	ownerId: string
}

//define the mongoose schema
const jobApplicationSchema: Schema<JobApplicationDocument> = new Schema(
	{
		id: {
			type: String,
			required: [true, 'All job applications need to have an ID'],
			unique: [true, 'Job application ID must be unique']
		},
		jobTitle: {
			type: String,
			required: [true, 'All job applications need a job title']
		},
		companyName: {
			type: String,
			required: [true, 'All job applications need a company name']
		},
		jobDescription: {
			type: String,
			required: [true, 'All job applications need a job description']
		},
		resume: {
			type: String,
			ref: 'Resume',
			required: [true, 'All job applications need a resume']
		},
		status: {
			type: String,
			required: [true, 'All job applications need a status'],
			enum: ['Applied', 'Interviewing', 'Rejected', 'Offer', 'Withdrawn']
		},
		ownerId: {
			type: String,
			required: [true, 'All job applications need an owner Id']
		},
		dateApplied: {
			type: Number,
			required: [true, 'All job applications need a date applied']
		},
		lastModified: {
			type: Number,
			required: [true, 'All job applications need a last modified date']
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
		collection: 'JobApplications'
	}
)

//factory function for retrieving the model
export function JobApplicationModel(connection: mongoose.Connection) {
	return (
		mongoose.models.JobApplication ||
		connection.model<JobApplicationDocument>('JobApplication', jobApplicationSchema)
	)
}

//JobApplicationRepository implemented with mongoose
export class MongoJobApplicationRepository implements JobApplicationRepository {
	private connection: mongoose.Connection

	constructor(connection: mongoose.Connection) {
		if (!connection) {
			throw new Error('No connection to the database')
		}

		this.connection = connection
	}

	/**
	 * Creates a job application in the database
	 * @param ownerId - The id of the user/owner of the job application
	 * @param jobApplication - The job application object to create
	 * @returns The created job application object
	 */
	async createJobApplication(ownerId: string, jobApplication: JobApplication): Promise<JobApplication> {
		const jobApplicationModel = JobApplicationModel(this.connection)

		try {
			const newJobApplication = (
				await (
					await jobApplicationModel.create({
						...jobApplication,
						resume: jobApplication.resume.id,
						ownerId
					})
				).populate({
					path: 'resume',
					model: 'Resume',
					localField: 'resume',
					foreignField: 'id',
					select: '-_id -__v -ownerId',
					options: { lean: true }
				})
			).toObject()

			return newJobApplication
		} catch (error) {
			console.error(`JobApplicationRepository failed to create a new job application: ${error}`)
			throw new Error('JobApplicationRepository failed to create a new job application')
		}
	}

	/**
	 * Gets a job application by id
	 * @param id - The id of the job application
	 * @returns The job application object or null if it doesn't exist
	 */
	async getJobApplicationById(id: string): Promise<JobApplication | null> {
		const jobApplicationModel = JobApplicationModel(this.connection)

		try {
			const jobApplication = await jobApplicationModel
				.findOne({ id })
				.lean<JobApplication>()
				.select('-_id -__v -ownerId')

			return jobApplication || null
		} catch (error) {
			console.error(`JobApplicationRepository failed to retrieve a job application by id: ${error}`)
			throw new Error('JobApplicationRepository failed to retrieve a job application by id')
		}
	}

	/**
	 * Gets job applications with the associated ownerId
	 * @param ownerId - The id of the user
	 * @returns An array of job applications that belong to the user
	 */
	async getJobApplicationsByOwnerId(ownerId: string): Promise<JobApplication[]> {
		const jobApplicationModel = JobApplicationModel(this.connection)

		try {
			const jobApplications = await jobApplicationModel
				.find({ ownerId })
				.populate({
					path: 'resume',
					model: 'Resume',
					localField: 'resume',
					foreignField: 'id',
					select: '-_id -__v -ownerId',
					options: { lean: true }
				})
				.lean<JobApplication[]>()
				.select('-_id -__v -ownerId')

			return jobApplications
		} catch (error) {
			console.error(`JobApplicationRepository failed to retrieve job applications: ${error}`)
			throw new Error('JobApplicationRepository failed to retrieve job applications')
		}
	}

	/**
	 * Gets the ownerId of a job application
	 * @param jobApplication - The job application object
	 * @returns The ownerId of the job application
	 */
	async getOwnerId(jobApplication: JobApplication): Promise<string> {
		const jobApplicationModel = JobApplicationModel(this.connection)

		try {
			const jobApplicationDocument = await jobApplicationModel
				.findOne({ id: jobApplication.id })
				.select('-_id -__v')

			return jobApplicationDocument.ownerId
		} catch (error) {
			console.error(`JobApplicationRepository failed to retrieve ownerId: ${error}`)
			throw new Error('JobApplicationRepository failed to retrieve ownerId')
		}
	}

	/**
	 * Updates a job application in the database
	 * @param id - The id of the job application to update
	 * @param updatedFields - The updated fields of the job application
	 * @returns The updated job application object
	 */
	async updateJobApplicationById(id: string, updatedFields: Partial<JobApplication>): Promise<JobApplication> {
		const jobApplicationModel = JobApplicationModel(this.connection)

		try {
			const updatedJobApplication = await jobApplicationModel
				.findOneAndUpdate(
					{ id },
					{
						$set: {
							...updatedFields,
							resume: updatedFields.resume!.id,
							lastModified: Date.now()
						}
					},
					{
						new: true
					}
				)
				.populate({
					path: 'resume',
					model: 'Resume',
					localField: 'resume',
					foreignField: 'id',
					select: '-_id -__v -ownerId',
					options: { lean: true }
				})
				.lean<JobApplication>()
				.select('-_id -__v -ownerId')

			if (!updatedJobApplication) {
				throw new Error('Job application not found')
			}

			return updatedJobApplication
		} catch (error) {
			console.error(`JobApplicationRepository failed to update a job application by id: ${error}`)
			throw new Error('JobApplicationRepository failed to update a job application by id')
		}
	}

	/**
	 * Deletes a job application by id
	 * @param id - The id of the job application to delete
	 * @returns The deleted job application object
	 */
	async deleteJobApplicationById(id: string): Promise<JobApplication> {
		const jobApplicationModel = JobApplicationModel(this.connection)

		try {
			const deletedJobApplication = await jobApplicationModel
				.findOneAndDelete({ id })
				.select('-_id -__v -ownerId')

			return deletedJobApplication
		} catch (error) {
			console.error(`JobApplicationRepository failed to delete a job application by id: ${error}`)
			throw new Error('JobApplicationRepository failed to delete a job application by id')
		}
	}
}
