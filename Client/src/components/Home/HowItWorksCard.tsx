import type {HowItWorksProps} from "@/types/home"

export function HowItWorksCard({number, title, description} : HowItWorksProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <span className="h-8 w-8 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-900 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {number}
                </span>
                <div className="h-px flex-1 bg-neutral-100 hidden md:block" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">{title}</h3>
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                {description}
            </p>
        </div>
    )
}