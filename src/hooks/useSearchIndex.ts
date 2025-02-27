import { SearchIndexContext } from '@/components/SearchIndexProvider'
import { useContext } from 'react'

export const useSearchIndex = () => {
    const searchIndexContext = useContext(SearchIndexContext)

    if (!searchIndexContext) {
        throw new Error('useSearchIndex must be used within a SearchIndexProvider')
    }

    return searchIndexContext
}
