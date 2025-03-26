import type { JobApplication } from '@/types/JobApplication'
import type { Resume } from '@/types/Resume'
import { clsx, type ClassValue } from 'clsx'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import { pdfjs } from 'react-pdf'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Parses the PDF file and returns the full text content
 * @param file - the PDF file to parse
 * @returns the full text content of the PDF file
 */
export const parsePdf = async (file: File): Promise<string> => {
	try {
		const pdfData = new Uint8Array(await file.arrayBuffer())
		const pdf = await pdfjs.getDocument(pdfData).promise

		return await extractTextFromPdf(pdf)
	} catch (error) {
		console.error('Error parsing PDF:', error)
		throw new Error('Failed to parse PDF')
	}
}

/**
 * Extracts the text content from a PDF file
 * @param pdf - the PDF file to extract text from
 * @returns the text content of the PDF file
 */
const extractTextFromPdf = async (pdf: PDFDocumentProxy): Promise<string> => {
	let fullText = ''

	for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
		const page = await pdf.getPage(pageNumber)
		const textContent = await page.getTextContent()

		// explicit any is required here to avoid typescript error
		/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
		const pageText = textContent.items.map((item: any) => item.str).join(' ')

		// Clean up the text:
		const cleanedText = pageText
			.replace(/[\u2022\u2023\u25AA\u25AB\u2013\u2014\u2015•◦●|,]/g, '')
			.replace(/\s+/g, ' ')
			.trim()

		fullText += cleanedText + ' '
	}

	return fullText.trim()
}

/**
 * Calculated application frequency for the last 30 days
 * @param applications - The array of job applications
 * @returns An array of objects containing the date and count of applications
 */
export const calculateApplicationFrequency = (applications: JobApplication[]) => {
	const today = new Date()
	const cutoffDate = new Date().setDate(today.getDate() - 30).valueOf()

	const recentApplications = applications
		.filter((application) => application.dateApplied >= cutoffDate)
		.sort((a, b) => (a.dateApplied < b.dateApplied ? -1 : 1))

	const allDates = recentApplications.map((application) => new Date(application.dateApplied).toLocaleDateString())
	const uniqueDates = [...new Set(allDates)]
	const applicationFrequency = uniqueDates.map((date) => ({
		date,
		count: allDates.filter((d) => d === date).length
	}))

	return applicationFrequency
}

/**
 * Calculated resume upload frequency for the last 30 days
 * @param resumes - The array of resumes
 * @returns An array of objects containing the date and count of resumes
 */
export const calculateResumeUploadFrequency = (resumes: Resume[]) => {
	const today = new Date()
	const cutoffDate = new Date().setDate(today.getDate() - 30).valueOf()

	const recentResumes = resumes
		.filter((resume) => resume.lastModified >= cutoffDate)
		.sort((a, b) => (a.lastModified < b.lastModified ? -1 : 1))

	const allDates = recentResumes.map((resume) => new Date(resume.lastModified).toLocaleDateString())
	const uniqueDates = [...new Set(allDates)]
	const resumeFrequency = uniqueDates.map((date) => ({
		date,
		count: allDates.filter((d) => d === date).length
	}))

	return resumeFrequency
}

/**
 * Calculates the recent activity for the last 30 days
 * @param applications - The array of job applications
 * @param resumes - The array of resumes
 * @returns An array of objects containing the date and count of recent activity
 */
export const calculateRecentActivity = (applications: JobApplication[], resumes: Resume[]) => {
	const today = new Date()
	const cutoffDate = new Date().setDate(today.getDate() - 30).valueOf()

	const recentApplications = applications
		.filter((application) => application.dateApplied >= cutoffDate)
		.sort((a, b) => (a.dateApplied > b.dateApplied ? -1 : 1))

	const recentResumes = resumes
		.filter((resume) => resume.lastModified >= cutoffDate)
		.sort((a, b) => (a.lastModified > b.lastModified ? -1 : 1))

	const recentActivity: (JobApplication | Resume)[] = []

	let i = 0
	let j = 0

	while (recentActivity.length < 5) {
		if (i < recentApplications.length && j < recentResumes.length) {
			if (recentApplications[i].dateApplied > recentResumes[j].lastModified) {
				recentActivity.push(recentApplications[i])
				i++
			} else {
				recentActivity.push(recentResumes[j])
				j++
			}
		} else {
			if (i < recentApplications.length) {
				recentActivity.push(recentApplications[i])
				i++
			} else if (j < recentResumes.length) {
				recentActivity.push(recentResumes[j])
				j++
			} else {
				break
			}
		}
	}

	return recentActivity
}

/**
 * Calculates the difference in days between two dates
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns The number of days between the two dates
 */
export function calculateDateDiff(date1: Date, date2: Date): number {
	if (!date1 || !date2) {
		throw new Error('Missing required parameters')
	}

	const oneDay = 24 * 60 * 60 * 1000
	return Math.round(Math.abs(date1.getTime() - date2.getTime()) / oneDay)
}

/**
 * Generates mock data for testing purposes
 * @param totalItems - The total number of items to generate
 * @returns An array of mock data objects
 */
export const generateMockData = (totalItems: number) => {
	const mockData = []
	const today = new Date()

	for (let i = 0; i < totalItems; i++) {
		const randomDaysAgo = Math.floor(Math.random() * 30)
		const date = new Date(today)
		date.setDate(today.getDate() - randomDaysAgo)

		const formattedDate = date.toISOString().split('T')[0]
		const count = Math.floor(Math.random() * 5) + 1

		mockData.push({ date: formattedDate, count })
	}

	return mockData.sort((a, b) => (a.date < b.date ? -1 : 1))
}
