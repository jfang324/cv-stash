import { clsx, type ClassValue } from 'clsx'
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
const extractTextFromPdf = async (pdf: any): Promise<string> => {
    let fullText = ''

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber)
        const textContent = await page.getTextContent()

        // Concatenate all text items from the page
        const pageText = textContent.items.map((item: any) => item.str).join(' ')

        // Clean up the text:
        const cleanedText = pageText
            // Remove bullet points, dashes, and other unwanted characters
            .replace(/[\u2022\u2023\u25AA\u25AB\u2013\u2014\u2015•◦●|,]/g, '')
            // Remove extra whitespace (multiple spaces, newlines, tabs)
            .replace(/\s+/g, ' ')
            // Remove leading and trailing whitespace
            .trim()

        fullText += cleanedText + ' '
    }

    return fullText.trim()
}
