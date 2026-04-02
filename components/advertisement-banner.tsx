"use client";

export function AdvertisementBanner() {
	return (
		<div className="rounded-[1.75rem] border border-sky-200/70 bg-gradient-to-r from-sky-100/75 via-white to-amber-50/80 p-5 shadow-[0_20px_60px_-40px_rgba(14,116,144,0.6)] dark:border-sky-900/40 dark:from-sky-950/30 dark:via-slate-950/40 dark:to-amber-950/20">
			<a
				href="https://beldoc.be"
				target="_blank"
				rel="noopener noreferrer"
				className="block transition-transform duration-200 hover:-translate-y-0.5"
			>
				<div className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
					<div className="space-y-1">
						<p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
							Recommendation from the team
						</p>
						<p className="text-base font-semibold text-slate-900 dark:text-slate-100">
							Need to incorporate a Belgian company? Beldoc handles it
							online with a cleaner, lower-friction flow.
						</p>
					</div>
					<div className="inline-flex items-center rounded-full border border-sky-300/70 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm dark:border-sky-800 dark:bg-slate-950/60 dark:text-sky-100">
						Visit beldoc.be
					</div>
				</div>
			</a>
		</div>
	);
}
