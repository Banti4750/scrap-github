import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import DeveloperCard, { type DeveloperCardData } from '../components/DeveloperCard'
import CompareBar from '../components/CompareBar'
import SkeletonCard from '../components/SkeletonCard'
import useDevelopers from '../hooks/useDevelopers'

const DEFAULT_SKILL = 'typescript'

export default function SearchPage() {
    const [skill, setSkill] = useState(DEFAULT_SKILL)
    const [minScore, setMinScore] = useState(0)
    const [limit, setLimit] = useState(10)
    const [query, setQuery] = useState(DEFAULT_SKILL)
    const [selected, setSelected] = useState<string[]>([])
    const { data, loading, error } = useDevelopers(query, minScore, limit)
    const navigate = useNavigate()

    const developers = data?.developers ?? []
    const avatars = useMemo(
        () =>
            developers.reduce<Record<string, string>>((acc, developer) => {
                acc[developer.username] = developer.avatar_url
                return acc
            }, {}),
        [developers],
    )

    const handleSearch = () => {
        setQuery(skill.trim())
    }

    const handleToggleCompare = (username: string) => {
        setSelected((current) => {
            if (current.includes(username)) return current.filter((item) => item !== username)
            if (current.length >= 3) return current
            return [...current, username]
        })
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-3">
                <h1 className="text-3xl font-semibold text-slate-900">Talent Discovery</h1>
                <p className="max-w-2xl text-sm text-slate-600">Search developers by skill, score, and GitHub activity.</p>
            </div>

            <SearchBar
                skill={skill}
                minScore={minScore}
                limit={limit}
                onSkillChange={setSkill}
                onMinScoreChange={setMinScore}
                onLimitChange={setLimit}
                onSearch={handleSearch}
            />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">{loading ? 'Loading developers...' : `${developers.length} developers found`}</p>
                {selected.length >= 2 && (
                    <button
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                        onClick={() => navigate(`/compare?users=${selected.join(',')}`)}
                    >
                        Compare {selected.length} developers
                    </button>
                )}
            </div>

            {error && <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>}
            {!loading && !error && developers.length === 0 && (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                    No developers found. Try a different skill.
                </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? Array.from({ length: limit }).map((_, index) => <SkeletonCard key={index} />)
                    : developers.map((developer) => (
                        <DeveloperCard
                            key={developer.username}
                            developer={developer}
                            checked={selected.includes(developer.username)}
                            onToggleCompare={handleToggleCompare}
                        />
                    ))}
            </div>

            <CompareBar selected={selected} avatars={avatars} />
        </main>
    )
}
