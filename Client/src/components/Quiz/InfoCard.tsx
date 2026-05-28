import type {InfoCardProps} from "@/types/quiz"

export function InfoCard({number, title, description}: InfoCardProps) {
    return (
            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                <p className="text-xs font-bold uppercase text-neutral-400 tracking-wider">{number}</p>
                <p className="text-sm font-bold text-neutral-800">{title}</p>
                <p className="text-xs text-neutral-500">{description}</p>
            </div>
    )
}