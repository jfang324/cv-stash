import { JobApplication } from '@/interfaces/JobApplication'
import { JobApplicationRepository } from '@/interfaces/JobApplicationRepository'
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
            unique: [true, 'Job application ID must be unique'],
        },
        jobTitle: {
            type: String,
            required: [true, 'All job applications need a job title'],
        },
        companyName: {
            type: String,
            required: [true, 'All job applications need a company name'],
        },
        jobDescription: {
            type: String,
            required: [true, 'All job applications need a job description'],
        },
        resume: {
            type: String,
            ref: 'Resume',
            required: [true, 'All job applications need a resume'],
        },
        status: {
            type: String,
            required: [true, 'All job applications need a status'],
            enum: ['Applied', 'Interviewing', 'Rejected', 'Offer', 'Withdrawn'],
        },
        ownerId: {
            type: String,
            required: [true, 'All job applications need an owner Id'],
        },
        lastModified: {
            type: Number,
            required: [true, 'All job applications need a last modified date'],
        },
    },
    { collection: 'JobApplications' }
)

//factory function for retrieving the model
function JobApplicationModel(connection: mongoose.Connection) {
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
                    options: { lean: true },
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
     * Creates a job application in the database
     * @param ownerId - The id of the user/owner of the job application
     * @param jobApplication - The job application object to create
     * @returns The created job application object
     */
    async createJobApplication(ownerId: string, jobApplication: JobApplication): Promise<JobApplication> {
        const jobApplicationModel = JobApplicationModel(this.connection)

        try {
            const newJobApplication = (
                await jobApplicationModel.create({ ...jobApplication, resume: jobApplication.resume.id, ownerId })
            ).toObject({
                select: ['-_id -__v -ownerId'],
            })

            return newJobApplication
        } catch (error) {
            console.error(`JobApplicationRepository failed to create a new job application: ${error}`)
            throw new Error('JobApplicationRepository failed to create a new job application')
        }
    }
}
