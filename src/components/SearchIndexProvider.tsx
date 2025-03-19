'use client'
import { Resume } from '@/interfaces/Resume'
import { apiClient } from '@/services/ApiClient'
import { useUser } from '@auth0/nextjs-auth0'
import Fuse from 'fuse.js'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { removeStopwords } from 'stopword'

interface SearchIndexProviderProps {
    children: React.ReactNode
}

export interface SearchIndexContextType {
    addToIndex: (resume: Resume) => void
    removeFromIndex: (resume: Resume) => void
    searchIndex: (query: string, numResults: number) => Resume[]
}

export const SearchIndexContext = createContext<SearchIndexContextType | null>(null)

export const SearchIndexProvider = ({ children }: SearchIndexProviderProps) => {
    const { user, isLoading } = useUser()
    const [index, setIndex] = useState<Fuse<Resume>>(
        new Fuse([], {
            keys: ['textContent'],
            includeScore: true,
            isCaseSensitive: false,
            ignoreDiacritics: true,
            ignoreLocation: true,
        })
    )

    useEffect(() => {
        const initializeIndex = async () => {
            if (!isLoading && user) {
                try {
                    const resumes = await apiClient.retrieveResumes()

                    setIndex(
                        new Fuse(resumes, {
                            keys: ['textContent'],
                            includeScore: true,
                            isCaseSensitive: false,
                            ignoreDiacritics: true,
                            ignoreLocation: true,
                        })
                    )
                } catch (error) {
                    console.error(error)
                }
            }
        }

        initializeIndex()
    }, [user, isLoading])

    /**
     * Adds a resume to the search index
     * @param resume - the resume to add to the search index
     */
    const addToIndex = useCallback(
        (resume: Resume) => {
            const updatedIndex = index
            updatedIndex.add(resume)

            setIndex(updatedIndex)
        },
        [index]
    )

    /**
     * Removes a resume from the search index
     * @param resume - the resume to remove from the search index
     */
    const removeFromIndex = useCallback(
        (resume: Resume) => {
            const updatedIndex = index
            updatedIndex.remove((doc) => {
                return doc.id === resume.id
            })

            setIndex(updatedIndex)
        },
        [index]
    )

    /**
     * Queries the search index and returns the results
     * @param query - the query to search for
     * @param numResults - the number of results to return
     * @returns the results of the search
     */
    const searchIndex = useCallback(
        (query: string, numResults: number = 5): Resume[] => {
            //remove punctuation, symbols and brackets from the query
            const cleanedText = query
                .replace(/[\u2022\u2023\u25AA\u25AB\u2013\u2014\u2015•◦●|,]/g, '\n')
                .split(/(?:\. |, |\n)/)
                .map((line) => {
                    return line
                        .replace(/[\[\]{}():;]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim()
                })
                .filter((line) => line.length > 0)
                .join(' ')

            //remove stopwords from the query to avoid diluting the search
            const keyWords = removeStopwords(cleanedText.split(' ')).map((word) => {
                return { textContent: word }
            })

            const results = index.search({ $or: keyWords }, { limit: numResults })

            return results.map((result) => result.item)
        },
        [index]
    )

    const contextValue = useMemo(
        () => ({
            addToIndex,
            removeFromIndex,
            searchIndex,
        }),
        [addToIndex, removeFromIndex, searchIndex]
    )

    return <SearchIndexContext.Provider value={contextValue}>{children}</SearchIndexContext.Provider>
}
