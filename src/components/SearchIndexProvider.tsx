'use client'
import { Resume } from '@/interfaces/Resume'
import { ApiClient } from '@/services/ApiClient'
import { useUser } from '@auth0/nextjs-auth0'
import elasticlunr from 'elasticlunr'
import { createContext, useEffect, useMemo, useState } from 'react'

interface SearchIndexProviderProps {
    children: React.ReactNode
}

interface SearchIndexContextType {
    index: elasticlunr.Index<Resume> | null
    addToIndex: (resume: Resume) => void
    removeFromIndex: (resume: Resume) => void
    searchIndex: (query: string) => Resume[]
}

export const SearchIndexContext = createContext<SearchIndexContextType | null>(null)

export const SearchIndexProvider = ({ children }: SearchIndexProviderProps) => {
    const { user, isLoading } = useUser()
    const [index, setIndex] = useState<elasticlunr.Index<Resume> | null>(null)
    const apiClient = useMemo(() => new ApiClient(), [])

    useEffect(() => {
        const initializeIndex = async () => {
            if (!isLoading && user) {
                try {
                    const resumes = await apiClient.retrieveResumes()
                    const updatedIndex: elasticlunr.Index<Resume> = elasticlunr(function () {
                        this.setRef('id')
                        this.addField('name')
                        this.addField('textContent')
                    })

                    resumes.forEach((resume) => {
                        updatedIndex.addDoc({
                            id: resume.id,
                            name: resume.name,
                            textContent: resume.textContent,
                            lastModified: resume.lastModified,
                        })
                    })
                    setIndex(updatedIndex)
                } catch (error) {
                    console.error(error)
                }
            }
        }
        initializeIndex()
    }, [user, isLoading, apiClient])

    const addToIndex = useMemo(
        () => (resume: Resume) => {
            if (index) {
                const updatedIndex: elasticlunr.Index<Resume> = index
                updatedIndex.addDoc({
                    id: resume.id,
                    name: resume.name,
                    textContent: resume.textContent,
                    lastModified: resume.lastModified,
                })
                setIndex(updatedIndex)
            }
        },
        [index]
    )

    const removeFromIndex = useMemo(
        () => (resume: Resume) => {
            if (index) {
                const updatedIndex: elasticlunr.Index<Resume> = index
                updatedIndex.removeDocByRef(resume.id)
                setIndex(updatedIndex)
            }
        },
        [index]
    )

    const searchIndex = useMemo(
        () =>
            (query: string): Resume[] => {
                if (index) {
                    const cleanedQuery = query
                        .replace(/[\u2022\u2023\u25AA\u25AB\u2013\u2014\u2015•◦●|,]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim()

                    const results = index.search(cleanedQuery, {
                        fields: {
                            id: { boost: 0 },
                            name: { boost: 0 },
                            textContent: { boost: 1 },
                            lastModified: { boost: 0 },
                        },
                        expand: true,
                        bool: 'OR',
                    })
                    return results.map((result) => index.documentStore.getDoc(result.ref))
                }

                return []
            },
        [index]
    )

    const contextValue = useMemo(
        () => ({
            index,
            addToIndex,
            removeFromIndex,
            searchIndex,
        }),
        [index, addToIndex, removeFromIndex, searchIndex]
    )

    return <SearchIndexContext.Provider value={contextValue}>{children}</SearchIndexContext.Provider>
}
