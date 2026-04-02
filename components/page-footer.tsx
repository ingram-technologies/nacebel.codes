"use client";

export function PageFooter() {
	return (
		<footer className="mt-12 rounded-[2rem] border border-white/60 bg-white/70 px-6 py-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1 text-sm text-muted-foreground">
					<p className="font-medium text-foreground">
						NACE-BEL 2025 directory and API
					</p>
					<p>
						© 2025{" "}
						<a
							href="https://ingram.tech"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground hover:text-primary"
						>
							Ingram Technologies
						</a>
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
					<a href="/" className="hover:text-foreground">
						Search
					</a>
					<a href="/about" className="hover:text-foreground">
						About
					</a>
					<a href="/api/docs" className="hover:text-foreground">
						API
					</a>
					<a
						href="mailto:contact@nacebel.codes"
						className="font-medium text-foreground hover:text-primary"
					>
						contact@nacebel.codes
					</a>
				</div>
			</div>
		</footer>
	);
}
