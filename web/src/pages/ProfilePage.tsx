import { useNavigate, useParams } from 'react-router-dom'
import useProfile from '../hooks/useProfile'
import LanguageBar from '../components/LanguageBar'
import SkeletonCard from '../components/SkeletonCard'

export default function ProfilePage() {
    const params = useParams()
    const username = params.username ?? ''
    const navigate = useNavigate()
    const { profile, loading, error } = useProfile(username)

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <button
                className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            {loading && <SkeletonCard />}
            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>}
            {profile && (
                <div className="space-y-8">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-6">
                                <img src={profile.avatar_url} alt={profile.name} className="h-28 w-28 rounded-full object-cover" />
                                <div>
                                    <p className="text-3xl font-semibold text-slate-900">{profile.name}</p>
                                    <p className="mt-1 text-sm text-slate-600">@{profile.username}</p>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{profile.bio}</p>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-slate-900 px-6 py-4 text-white">
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Score</p>
                                <p className="mt-2 text-4xl font-semibold">{profile.score}</p>
                                <p className="mt-3 text-sm text-slate-300">{profile.followers} followers</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-xl font-semibold text-slate-900">Language Breakdown</h2>
                            <LanguageBar languages={profile.top_languages} />
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-xl font-semibold text-slate-900">Stats</h2>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl bg-slate-50 p-5 text-center">
                                    <p className="text-3xl font-semibold text-slate-900">{profile.total_stars}</p>
                                    <p className="mt-2 text-sm text-slate-600">Stars</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5 text-center">
                                    <p className="text-3xl font-semibold text-slate-900">{profile.commits_last_90d}</p>
                                    <p className="mt-2 text-sm text-slate-600">Commits (90d)</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5 text-center">
                                    <p className="text-3xl font-semibold text-slate-900">{profile.repo_count}</p>
                                    <p className="mt-2 text-sm text-slate-600">Repos</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold text-slate-900">Top Repositories</h2>
                        <div className="space-y-4">
                            {profile.top_repos.map((repo) => (
                                <a
                                    key={repo.name}
                                    href={repo.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-lg font-semibold text-slate-900">{repo.name}</p>
                                            <p className="mt-1 text-sm text-slate-600">{repo.language}</p>
                                        </div>
                                        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">⭐ {repo.stars}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
