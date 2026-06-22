import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export type DeveloperCardData = {
    rank: number
    username: string
    name: string
    avatar_url: string
    score: number
    top_languages: Array<{ name: string; bytes: number }>
    commits_last_90d: number
    total_stars: number
    repo_count: number
    github_url: string
}

type Props = {
    developer: DeveloperCardData
    checked: boolean
    onToggleCompare: (username: string) => void
}

export default function DeveloperCard({ developer, checked, onToggleCompare }: Props) {
    const scoreColor = useMemo(() => {
        if (developer.score > 200) return 'bg-emerald-500 text-white'
        if (developer.score > 100) return 'bg-amber-400 text-slate-900'
        return 'bg-slate-300 text-slate-800'
    }, [developer.score])

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute left-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">#{developer.rank}</div>
            <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide shadow-sm ${scoreColor}`}>{developer.score}</div>
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <img src={developer.avatar_url} alt={developer.name} className="h-16 w-16 rounded-full object-cover" />
                    <div>
                        <p className="text-lg font-semibold text-slate-900">{developer.name}</p>
                        <p className="text-sm text-slate-500">@{developer.username}</p>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {developer.top_languages.slice(0, 3).map((language) => (
                        <span key={language.name} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {language.name}
                        </span>
                    ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm text-slate-600">
                    <div className="rounded-3xl bg-slate-50 px-3 py-4">
                        <div className="text-base font-semibold text-slate-900">{developer.total_stars}</div>
                        <div>⭐ Stars</div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-3 py-4">
                        <div className="text-base font-semibold text-slate-900">{developer.commits_last_90d}</div>
                        <div>💻 Commits</div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-3 py-4">
                        <div className="text-base font-semibold text-slate-900">{developer.repo_count}</div>
                        <div>📦 Repos</div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                        to={`/profile/${developer.username}`}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        View Profile
                    </Link>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" checked={checked} onChange={() => onToggleCompare(developer.username)} />
                        Compare
                    </label>
                </div>
            </div>
        </div>
    )
}
