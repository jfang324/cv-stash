'use client'
import { apiClient } from '@/services/ApiClient'
import type { Resume } from '@/types/Resume'
import { useUser } from '@auth0/nextjs-auth0'
import { useQuery } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { removeStopwords } from 'stopword'

interface SearchIndexProviderProps {
	children: React.ReactNode
}

export interface SearchIndexContextType {
	isLoading: boolean
	error: Error | null
	searchIndex: (query: string, numResults: number) => Resume[]
}

export const SearchIndexContext = createContext<SearchIndexContextType | null>(null)

export const SearchIndexProvider = ({ children }: SearchIndexProviderProps) => {
	const { user, isLoading: authLoading } = useUser()

	const {
		data: resumes,
		isLoading: queryLoading,
		error: queryError
	} = useQuery({
		queryKey: ['resumes', user?.sub],
		queryFn: () => apiClient.getResumes(),
		staleTime: 60 * 1000,
		placeholderData: []
	})

	const [index, setIndex] = useState<Fuse<Resume>>(
		new Fuse([], {
			keys: ['textContent'],
			includeScore: true,
			isCaseSensitive: false,
			ignoreDiacritics: true,
			ignoreLocation: true
		})
	)

	const isLoading = authLoading || queryLoading

	useEffect(() => {
		if (!isLoading && user) {
			setIndex(
				new Fuse(resumes || [], {
					keys: ['textContent'],
					includeScore: true,
					isCaseSensitive: false,
					ignoreDiacritics: true,
					ignoreLocation: true
				})
			)
		}
	}, [user, isLoading, resumes])

	/**
	 * Queries the search index and returns the results
	 * @param query - the query to search for
	 * @param numResults - the number of results to return
	 * @returns the results of the search
	 */
	const searchIndex = useCallback(
		(query: string, numResults: number = 5): Resume[] => {
			//remove punctuation, symbols and brackets from the query
			const keyPhrases = query
				.replace(/[\u2022\u2023\u25AA\u25AB\u2013\u2014\u2015•◦●|,]/g, '\n')
				.split(/(?:\. |, |\n)/)
				.map((line) => {
					return line
						.replace(/[\[\]{}():;]/g, '')
						.replace(/\s+/g, ' ')
						.trim()
				})
				.filter((line) => line.length > 0)

			const keyWords = removeStopwords(keyPhrases.join(' ').split(' ')).map((word) => {
				return { textContent: word }
			})

			const results = index.search(
				{
					$or: [...keyWords, ...keyPhrases.map((phrase) => ({ textContent: phrase }))]
				},
				{ limit: numResults }
			)

			return results.map((result) => result.item)
		},
		[index]
	)

	const contextValue = useMemo(
		() => ({
			isLoading,
			error: queryError,
			searchIndex
		}),
		[isLoading, queryError, searchIndex]
	)

	return <SearchIndexContext.Provider value={contextValue}>{children}</SearchIndexContext.Provider>
}
