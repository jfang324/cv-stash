import { SearchIndexContext, SearchIndexContextType } from '@/components/providers/SearchIndexProvider'
import { useContext } from 'react'

export const useSearchIndex = (): SearchIndexContextType => {
	const searchIndexContext = useContext(SearchIndexContext)

	if (!searchIndexContext) {
		throw new Error('useSearchIndex must be used within a SearchIndexProvider')
	}

	return searchIndexContext
}
