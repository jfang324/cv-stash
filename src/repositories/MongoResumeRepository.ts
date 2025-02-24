import { Resume } from '@/interfaces/Resume'
import { ResumeRepository } from '@/interfaces/ResumeRepository'
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
            unique: [true, 'Resume ID must be unique'],
        },
        name: {
            type: String,
            required: [true, 'All resumes need a name'],
        },
        textContent: {
            type: String,
            required: [true, 'All resumes need some text content'],
        },
        ownerId: {
            type: String,
            required: [true, 'All resumes need an owner Id'],
        },
    },
    { collection: 'Resumes' }
)

//factory function for retrieving the model
function ResumeModel(connection: mongoose.Connection) {
    return mongoose.models.Resume || connection.model<ResumeDocument>('Resume', resumeSchema)
}

//maps a document to an object
function mapResumeDocumentToResume(resumeDocument: ResumeDocument): Resume {
    if (
        !resumeDocument ||
        !resumeDocument.id ||
        !resumeDocument.name ||
        !resumeDocument.textContent ||
        !resumeDocument.ownerId
    ) {
        throw new Error('Invalid Resume Document')
    }

    return {
        id: resumeDocument.id,
        name: resumeDocument.name,
        textContent: resumeDocument.textContent,
    }
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
     * Gets resumes with the associated ownerId
     * @param ownerId - The id of the user
     * @returns An array of resumes that belong to the user
     */
    async getResumesByOwnerId(ownerId: string): Promise<Resume[]> {
        const resumeModel = ResumeModel(this.connection)

        try {
            const resumes = await resumeModel.find({ ownerId })

            return resumes.map((resume) => mapResumeDocumentToResume(resume))
        } catch (error) {
            console.error(`ResumeRepository failed to retrieve resumes by owner ID: ${error}`)
            throw new Error('ResumeRepository failed to retrieve resumes by owner ID')
        }
    }

    /**
     * Creates a resume in the database with the given parameters
     * @param id - The id of the resume
     * @param name - The resume name
     * @param textContent - The text content of the resume
     * @param ownerId - The id of the user/owner of the resume
     * @returns The resume object created
     */
    async createResume(id: string, name: string, textContent: string, ownerId: string): Promise<Resume> {
        const resumeModel = ResumeModel(this.connection)

        try {
            const resume = await resumeModel.create({ id, name, textContent, ownerId })

            return mapResumeDocumentToResume(resume)
        } catch (error) {
            console.error(`ResumeRepository failed to create a new resume: ${error}`)
            throw new Error('ResumeRepository failed to create a new resume')
        }
    }
}
