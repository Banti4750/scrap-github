import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { downloadCsv, exportComparisonCsv } from '../utils/csv'
import { fetchProfile, type Profile } from '../utils/api'
import SkeletonCard from '../components/SkeletonCard'

export default function ComparePage() {
    const [searchParams] = useSearchParams()
    const users = useMemo(() => searchParams.get('users')?.split(',').filter(Boolean) ?? [], [searchParams])
    const navigate = useNavigate()
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (users.length === 0) {
            navigate('/')
            return
        }

        let active = true
        setLoading(true)
        setError(null)

        Promise.all(users.map((username) => fetchProfile(username)))
            .then((results) => {
                if (active) {
                    setProfiles(results)
                }
            })
            .catch((err) => {
                if (active) setError(err.message || 'Failed to load comparison')
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [navigate, users])

    const winnerScores = useMemo(() => {
        if (profiles.length === 0) return null
        const winners = {
            score: Math.max(...profiles.map((profile) => profile.score)),
            stars: Math.max(...profiles.map((profile) => profile.total_stars)),
            commits: Math.max(...profiles.map((profile) => profile.commits_last_90d)),
            repos: Math.max(...profiles.map((profile) => profile.repo_count)),
            languages: Math.max(...profiles.map((profile) => profile.top_languages.length)),
        }
        return winners
    }, [profiles])

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">Compare Developers</h1>
                    <p className="mt-1 text-sm text-slate-600">Comparing {users.length} developers side by side.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                        onClick={() => {
                            const csv = exportComparisonCsv(users, profiles)
                            downloadCsv('developer-comparison.csv', csv)
                        }}
                        disabled={loading || profiles.length === 0}
                    >
                        Export CSV
                    </button>
                    <button
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                        onClick={() => navigate('/')}
                    >
                        Clear & Start Over
                    </button>
                </div>
            </div>

            {loading && <SkeletonCard />}
            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>}

            {!loading && !error && profiles.length > 0 && winnerScores && (
                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <table className="min-w-full border-collapse text-left text-sm">
                        <thead>
                            <tr>
                                <th className="border-b border-slate-200 px-4 py-3 text-slate-500">Metric</th>
                                {profiles.map((profile) => (
                                    <th key={profile.username} className="border-b border-slate-200 px-4 py-3 text-slate-500">
                                        {profile.username}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { label: 'Score', value: (profile: Profile) => String(profile.score), winner: winnerScores.score },
                                { label: 'Stars', value: (profile: Profile) => String(profile.total_stars), winner: winnerScores.stars },
                                { label: 'Commits (90d)', value: (profile: Profile) => String(profile.commits_last_90d), winner: winnerScores.commits },
                                { label: 'Repos', value: (profile: Profile) => String(profile.repo_count), winner: winnerScores.repos },
                                { label: 'Top Language', value: (profile: Profile) => profile.top_languages[0]?.name ?? '-', winner: '' },
                                { label: 'Languages', value: (profile: Profile) => String(profile.top_languages.length), winner: winnerScores.languages },
                            ].map((row) => (
                                <tr key={row.label} className="border-b border-slate-100">
                                    <td className="px-4 py-4 font-semibold text-slate-700">{row.label}</td>
                                    {profiles.map((profile) => {
                                        const value = row.value(profile)
                                        const isWinner = row.winner !== '' && Number(value) === Number(row.winner)
                                        return (
                                            <td
                                                key={`${profile.username}-${row.label}`}
                                                className={`px-4 py-4 ${isWinner ? 'bg-emerald-100 text-slate-900' : 'text-slate-600'}`}
                                            >
                                                {value}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    )
}
