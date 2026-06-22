type Props = {
    languages: Array<{ name: string; bytes: number }>
}

export default function LanguageBar({ languages }: Props) {
    const total = languages.reduce((sum, entry) => sum + entry.bytes, 0)

    return (
        <div className="space-y-4">
            {languages.map((language) => {
                const width = total ? Math.max(8, Math.round((language.bytes / total) * 100)) : 0
                return (
                    <div key={language.name}>
                        <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                            <span>{language.name}</span>
                            <span>{total ? `${Math.round((language.bytes / total) * 100)}%` : '0%'}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-slate-900" style={{ width: `${width}%` }} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
