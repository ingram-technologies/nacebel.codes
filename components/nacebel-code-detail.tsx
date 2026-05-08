import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageFooter } from "@/components/page-footer";
import { type CodeData, codeHrefFor, codeTitleFor } from "@/lib/code-page";
import type { Locale } from "@/lib/i18n/locales";
import { translations } from "@/lib/translations";

const levelColorClasses: Record<number, string> = {
	2: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-300/20",
	3: "bg-amber-500/15 text-amber-700 ring-amber-600/20 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-300/20",
	4: "bg-sky-500/15 text-sky-700 ring-sky-600/20 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-300/20",
	5: "bg-rose-500/15 text-rose-700 ring-rose-600/20 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-300/20",
};

interface CodeDetailProps {
	data: CodeData;
	locale: Locale;
	ancestors: CodeData[];
	children: CodeData[];
}

export function NacebelCodeDetail({
	data,
	locale,
	ancestors,
	children,
}: CodeDetailProps) {
	const t = translations[locale];
	const title = codeTitleFor(data, locale);
	const description = data.description[locale] || data.description.en || "";
	const kboLink = `https://kbopub.economie.fgov.be/kbopub/naceToelichting.html?lang=${locale}&nace.code=${data.code.replace(/\./g, "")}&nace.version=2025`;
	const parent = ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
	const levelClass = levelColorClasses[data.level] ?? "bg-primary/10 text-primary ring-primary/20";

	return (
		<div className="bg-background text-foreground">
			<div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:py-12">
				<nav
					aria-label="Breadcrumb"
					className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
				>
					<a href="/" className="hover:text-foreground">
						{t.title}
					</a>
					{ancestors.map((ancestor) => (
						<span key={ancestor.code} className="flex items-center gap-2">
							<ChevronRight className="h-3.5 w-3.5" />
							<a
								href={codeHrefFor(ancestor, locale)}
								className="hover:text-foreground"
							>
								<code className="font-mono">{ancestor.code}</code>{" "}
								{codeTitleFor(ancestor, locale)}
							</a>
						</span>
					))}
					<span className="flex items-center gap-2">
						<ChevronRight className="h-3.5 w-3.5" />
						<span className="text-foreground">
							<code className="font-mono">{data.code}</code>
						</span>
					</span>
				</nav>

				<header className="space-y-4 rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
					<div className="flex flex-wrap items-center gap-3">
						<span
							className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${levelClass}`}
						>
							<code className="font-mono">{data.code}</code>
						</span>
						<span className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
							{t.level} {data.level}
						</span>
					</div>
					<h1 className="font-display text-3xl tracking-tight sm:text-4xl">
						{title}
					</h1>
					{description && description !== title ? (
						<p className="text-lg leading-8 text-muted-foreground">
							{description}
						</p>
					) : null}
					<div className="flex flex-wrap gap-3 pt-2">
						<Button variant="outline" asChild>
							<a href="/">
								<ArrowLeft className="mr-2 h-4 w-4" />
								{t.backToDirectory}
							</a>
						</Button>
						<Button variant="outline" asChild>
							<a href={kboLink} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="mr-2 h-4 w-4" />
								{t.viewOnKbo}
							</a>
						</Button>
					</div>
				</header>

				{parent ? (
					<section className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
						<h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
							{t.parentCode}
						</h2>
						<a
							href={codeHrefFor(parent, locale)}
							className="mt-3 flex items-center gap-3 rounded-[1.5rem] border border-border/70 bg-background/80 p-5 transition-colors hover:border-primary/30"
						>
							<code className="font-mono text-base font-semibold">
								{parent.code}
							</code>
							<span className="text-base">
								{codeTitleFor(parent, locale)}
							</span>
						</a>
					</section>
				) : null}

				{children.length > 0 ? (
					<section className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
						<h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
							{t.childCodes}
						</h2>
						<ul className="mt-3 grid gap-2 md:grid-cols-2">
							{children.map((child) => (
								<li key={child.code}>
									<a
										href={codeHrefFor(child, locale)}
										className="flex items-center gap-3 rounded-[1.25rem] border border-border/70 bg-background/80 p-4 transition-colors hover:border-primary/30"
									>
										<code className="font-mono text-sm font-semibold">
											{child.code}
										</code>
										<span className="text-sm">
											{codeTitleFor(child, locale)}
										</span>
									</a>
								</li>
							))}
						</ul>
					</section>
				) : null}

				<PageFooter />
			</div>
		</div>
	);
}
