export default function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-5 w-20 rounded-full bg-slate-200" />
            <div className="mt-6 flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-200" />
                <div className="space-y-3 flex-1">
                    <div className="h-4 w-3/5 rounded-full bg-slate-200" />
                    <div className="h-4 w-2/5 rounded-full bg-slate-200" />
                </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="h-16 rounded-3xl bg-slate-200" />
                <div className="h-16 rounded-3xl bg-slate-200" />
                <div className="h-16 rounded-3xl bg-slate-200" />
            </div>
            <div className="mt-6 h-10 rounded-3xl bg-slate-200" />
        </div>
    )
}
