import { FormEvent } from 'react'

type Props = {
    skill: string
    minScore: number
    limit: number
    onSkillChange: (value: string) => void
    onMinScoreChange: (value: number) => void
    onLimitChange: (value: number) => void
    onSearch: () => void
}

export default function SearchBar({ skill, minScore, limit, onSkillChange, onMinScoreChange, onLimitChange, onSearch }: Props) {
    return (
        <form
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            onSubmit={(event: FormEvent) => {
                event.preventDefault()
                onSearch()
            }}
        >
            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Skill / Language</label>
                    <input
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        value={skill}
                        onChange={(event) => onSkillChange(event.target.value)}
                        placeholder="typescript, python, go"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Min Score</label>
                    <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>{minScore}</span>
                            <span>0–500</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            value={minScore}
                            onChange={(event) => onMinScoreChange(Number(event.target.value))}
                            className="mt-3 w-full cursor-pointer"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Limit</label>
                    <select
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        value={limit}
                        onChange={(event) => onLimitChange(Number(event.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            <button className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Search
            </button>
        </form>
    )
}
