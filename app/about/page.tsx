import { PageFooter } from "@/components/page-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About NACE-BEL Codes",
	description:
		"Learn how NACE and NACE-BEL classify economic activities in Belgium and across Europe.",
	openGraph: {
		title: "About NACE-BEL Codes",
		description:
			"Learn how NACE and NACE-BEL classify economic activities in Belgium and across Europe.",
		type: "website",
	},
};

const levels = [
	{
		level: "Level 2",
		code: "01",
		title: "Section",
		description: "The broadest practical grouping used in the public directory.",
		tone: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
	},
	{
		level: "Level 3",
		code: "01.1",
		title: "Division",
		description: "Adds a more specific economic branch within the section.",
		tone: "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
	},
	{
		level: "Level 4",
		code: "01.11",
		title: "Group",
		description: "Narrows the activity into a more precise operational category.",
		tone: "bg-sky-500/15 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200",
	},
	{
		level: "Level 5",
		code: "01.111",
		title: "Class",
		description: "The most specific level published in this directory.",
		tone: "bg-rose-500/15 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
	},
];

const versions = [
	{
		title: "NACE-BEL 2003",
		description:
			"Based on NACE Rev. 1.1 and used earlier in the 2000s to reflect the economy of that period.",
	},
	{
		title: "NACE-BEL 2008",
		description:
			"Aligned with NACE Rev. 2 and introduced important updates for services and digital activity.",
	},
	{
		title: "NACE-BEL 2025",
		description:
			"The current version, updated for newer economic realities while staying aligned with European standards.",
	},
];

const applications = [
	{
		title: "Business registration",
		description:
			"Belgian companies use NACE-BEL codes when incorporating and updating official records.",
	},
	{
		title: "Tax and compliance",
		description:
			"Authorities use classifications to segment businesses for administrative and regulatory work.",
	},
	{
		title: "Statistics and reporting",
		description:
			"Economic data can be collected and compared consistently across sectors and countries.",
	},
	{
		title: "Procurement and tenders",
		description:
			"Public and private tender flows often rely on activity codes to define scope.",
	},
];

export default function AboutPage() {
	return (
		<div className="bg-background text-foreground">
			<div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:py-12">
				<header className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.7)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10">
					<div className="absolute -left-16 top-0 h-52 w-52 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/15" />
					<div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />
					<div className="relative space-y-6">
						<div className="flex flex-wrap gap-3">
							<Button variant="outline" size="sm" asChild>
								<a href="/">Back to search</a>
							</Button>
							<Button variant="outline" size="sm" asChild>
								<a href="/api/docs">API Docs</a>
							</Button>
						</div>
						<Badge className="w-fit border-primary/15 bg-primary/10 text-primary hover:bg-primary/10">
							About the classification
						</Badge>
						<div className="space-y-4">
							<h1 className="font-display text-5xl tracking-tight sm:text-6xl">
								About NACE-BEL Codes
							</h1>
							<p className="max-w-3xl text-balance text-lg leading-8 text-muted-foreground">
								NACE and NACE-BEL are the shared vocabulary for
								classifying economic activity in Europe and Belgium.
								They help businesses, administrations, and analysts talk
								about the same work with a common structure.
							</p>
						</div>
					</div>
				</header>

				<section className="grid gap-6 lg:grid-cols-2">
					<article className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
						<h2 className="font-display text-3xl tracking-tight">
							What is NACE?
						</h2>
						<p className="mt-4 leading-8 text-muted-foreground">
							NACE, short for the European statistical classification of
							economic activities, is used across the European Union to
							group business activity into a consistent hierarchy.
						</p>
						<p className="mt-4 leading-8 text-muted-foreground">
							It is the backbone for comparable statistics, business
							registers, and a range of administrative processes that
							depend on describing what an organization actually does.
						</p>
					</article>
					<article className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
						<h2 className="font-display text-3xl tracking-tight">
							What is NACE-BEL?
						</h2>
						<p className="mt-4 leading-8 text-muted-foreground">
							NACE-BEL is Belgium&apos;s national implementation of NACE.
							It keeps the European structure but adds the specificity
							needed for Belgian administrative and economic use.
						</p>
						<p className="mt-4 leading-8 text-muted-foreground">
							Belgian businesses rely on NACE-BEL codes for registration,
							compliance, tax-related workflows, and official reporting.
						</p>
					</article>
				</section>

				<section className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
					<div className="space-y-3">
						<h2 className="font-display text-3xl tracking-tight">
							Code structure
						</h2>
						<p className="max-w-3xl text-muted-foreground">
							The codes form a hierarchy from broader sectors down to more
							specific classes. That lets businesses classify themselves
							at the right degree of detail.
						</p>
					</div>
					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{levels.map((item) => (
							<div
								key={item.level}
								className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5 shadow-sm"
							>
								<div className="flex items-center justify-between gap-4">
									<span
										className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.tone}`}
									>
										{item.level}
									</span>
									<code className="rounded-full border border-border/70 bg-background px-3 py-1 text-sm">
										{item.code}
									</code>
								</div>
								<h3 className="mt-4 text-xl font-semibold">
									{item.title}
								</h3>
								<p className="mt-2 text-sm leading-7 text-muted-foreground">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
					<article className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
						<h2 className="font-display text-3xl tracking-tight">
							NACE-BEL versions
						</h2>
						<div className="mt-6 space-y-4">
							{versions.map((version) => (
								<div
									key={version.title}
									className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5 shadow-sm"
								>
									<h3 className="text-xl font-semibold">
										{version.title}
									</h3>
									<p className="mt-2 leading-7 text-muted-foreground">
										{version.description}
									</p>
								</div>
							))}
						</div>
					</article>
					<article className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
						<h2 className="font-display text-3xl tracking-tight">
							International context
						</h2>
						<p className="mt-4 leading-8 text-muted-foreground">
							NACE is derived from the United Nations ISIC framework,
							which means European activity data can still be compared in
							a broader international context.
						</p>
						<p className="mt-4 leading-8 text-muted-foreground">
							Eurostat and national statistical offices periodically
							review the classification so it keeps pace with how the
							economy changes.
						</p>
						<div className="mt-6 rounded-[1.5rem] border border-primary/15 bg-primary/10 p-5">
							<p className="text-sm leading-7 text-primary/80">
								The main idea is simple: everyone uses the same
								structure, so analysis, reporting, and administration
								stay consistent.
							</p>
						</div>
					</article>
				</section>

				<section className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
					<div className="space-y-3">
						<h2 className="font-display text-3xl tracking-tight">
							Applications and uses
						</h2>
						<p className="max-w-3xl text-muted-foreground">
							NACE-BEL codes matter well beyond statistics. They appear
							across the practical machinery of running and regulating
							businesses.
						</p>
					</div>
					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{applications.map((application) => (
							<div
								key={application.title}
								className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5 shadow-sm"
							>
								<h3 className="text-xl font-semibold">
									{application.title}
								</h3>
								<p className="mt-2 leading-7 text-muted-foreground">
									{application.description}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-[2rem] border border-primary/15 bg-primary/10 p-6 shadow-[0_24px_70px_-50px_rgba(30,64,175,0.45)] sm:p-8">
					<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
						<div className="space-y-4">
							<h2 className="font-display text-3xl tracking-tight text-primary">
								Finding the right code
							</h2>
							<p className="text-primary/80">
								The best code is the one that reflects the main activity
								of the business. If you are unsure, use the search
								directory to explore related activities and cross-check
								against official Belgian guidance.
							</p>
							<div className="flex flex-wrap gap-3">
								<Button asChild>
									<a href="/">Start searching</a>
								</Button>
								<Button variant="outline" asChild>
									<a href="mailto:contact@nacebel.codes">
										Contact us
									</a>
								</Button>
							</div>
						</div>
						<div className="rounded-[1.5rem] border border-primary/15 bg-background/85 p-5 shadow-sm">
							<p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
								Practical advice
							</p>
							<p className="mt-3 text-sm leading-7 text-muted-foreground">
								If the classification affects a formal filing or legal
								obligation, confirm the final choice with a professional
								advisor or the relevant Belgian authority.
							</p>
						</div>
					</div>
				</section>

				<PageFooter />
			</div>
		</div>
	);
}
