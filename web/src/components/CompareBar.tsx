import { Link } from 'react-router-dom'

type Props = {
    selected: string[]
    avatars: Record<string, string>
}

export default function CompareBar({ selected, avatars }: Props) {
    if (selected.length < 2) return null

    return (
        <div className="sticky bottom-0 z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-slate-200 bg-white px-6 py-4 shadow-xl">
            <div className="flex items-center gap-3">
                {selected.map((username) => (
                    <img
                        key={username}
                        src={avatars[username]}
                        alt={username}
                        className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                    />
                ))}
            </div>
            <Link
                to={`/compare?users=${selected.join(',')}`}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
                Compare Now
            </Link>
        </div>
    )
}
