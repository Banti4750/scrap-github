import { useEffect, useState } from 'react'
import { searchDevelopers, type DeveloperSearchResult } from '../utils/api'

export default function useDevelopers(skill: string, minScore: number, limit: number) {
  const [data, setData] = useState<DeveloperSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!skill) {
      setData(null)
      setError(null)
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    searchDevelopers(skill, minScore, limit)
      .then((result) => {
        if (active) {
          setData(result)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Failed to load developers')
          setData(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [skill, minScore, limit])

  return { data, loading, error }
}
