import { useEffect, useState } from 'react'
import { fetchProfile, type Profile } from '../utils/api'

export default function useProfile(username: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) return

    let active = true
    setLoading(true)
    setError(null)

    fetchProfile(username)
      .then((result) => {
        if (active) setProfile(result)
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Failed to load profile')
          setProfile(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [username])

  return { profile, loading, error }
}
