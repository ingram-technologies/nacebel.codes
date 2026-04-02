"use client";

interface AdvertisementBannerProps {
	label: string;
	text: string;
	cta: string;
}

export function AdvertisementBanner({ label, text, cta }: AdvertisementBannerProps) {
	return (
		<div className="rounded-[1.25rem] border border-sky-200/70 bg-gradient-to-r from-sky-100/75 via-white to-amber-50/80 p-4 shadow-[0_18px_50px_-42px_rgba(14,116,144,0.6)] dark:border-sky-900/40 dark:from-sky-950/30 dark:via-slate-950/40 dark:to-amber-950/20">
			<a
				href="https://beldoc.be"
				target="_blank"
				rel="noopener noreferrer"
				className="block"
			>
				<div className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
					<div className="space-y-1">
						<p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
							{label}
						</p>
						<p className="text-sm font-medium text-slate-900 dark:text-slate-100 sm:text-base">
							{text}
						</p>
					</div>
					<div className="inline-flex items-center rounded-full border border-sky-300/70 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm dark:border-sky-800 dark:bg-slate-950/60 dark:text-sky-100">
						{cta}
					</div>
				</div>
			</a>
		</div>
	);
}
