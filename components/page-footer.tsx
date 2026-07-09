import { ArrowUpRight } from "lucide-react";

export function PageFooter() {
	return (
		<footer className="mt-14 border-t border-border">
			{/* Sponsor — a quiet strip, not the lead. */}
			<div className="border-b border-border bg-muted/40">
				<div className="container flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
					<p className="text-muted-foreground">
						Incorporating a Belgian company?{" "}
						<span className="text-foreground">
							Beldoc handles it online, with less friction.
						</span>
					</p>
					<a
						href="https://beldoc.be"
						target="_blank"
						rel="noopener"
						className="inline-flex w-fit items-center gap-1 font-medium text-primary hover:underline"
					>
						beldoc.be
						<ArrowUpRight className="h-3.5 w-3.5" />
					</a>
				</div>
			</div>

			<div className="container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1 text-sm text-muted-foreground">
					<p className="font-semibold text-foreground">
						nacebel<span className="text-primary">.codes</span>
					</p>
					<p>
						NACE-BEL 2025 directory and API · © {new Date().getFullYear()}{" "}
						<a
							href="https://ingram.tech"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground transition-colors hover:text-primary"
						>
							Ingram Technologies
						</a>
					</p>
				</div>
				<nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
					<a href="/" className="transition-colors hover:text-foreground">
						Search
					</a>
					<a
						href="/about"
						className="transition-colors hover:text-foreground"
					>
						About
					</a>
					<a
						href="/api/docs"
						className="transition-colors hover:text-foreground"
					>
						API
					</a>
					<a
						href="mailto:contact@nacebel.codes"
						className="font-medium text-foreground transition-colors hover:text-primary"
					>
						contact@nacebel.codes
					</a>
				</nav>
			</div>
		</footer>
	);
}
