import { PageFooter } from "@/components/page-footer";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

const aboutDescription =
	"Learn how NACE and NACE-BEL classify economic activities in Belgium and across Europe — the hierarchy, the 2003/2008/2025 versions, and where the codes are used.";

const aboutLanguages: Record<string, string> = {
	"x-default": "https://nacebel.codes/about",
	en: "https://nacebel.codes/en/about",
	"nl-BE": "https://nacebel.codes/nl/about",
	"fr-BE": "https://nacebel.codes/fr/about",
	de: "https://nacebel.codes/de/about",
};

export const metadata: Metadata = {
	title: "About NACE-BEL Codes",
	description: aboutDescription,
	alternates: { canonical: "/about", languages: aboutLanguages },
	openGraph: {
		title: "About NACE-BEL Codes",
		description: aboutDescription,
		url: "https://nacebel.codes/about",
		type: "article",
	},
	twitter: {
		card: "summary",
		title: "About NACE-BEL Codes",
		description: aboutDescription,
	},
};

const breadcrumbJsonLd = {
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: [
		{
			"@type": "ListItem",
			position: 1,
			name: "NACE-BEL 2025 Codes",
			item: "https://nacebel.codes",
		},
		{
			"@type": "ListItem",
			position: 2,
			name: "About",
			item: "https://nacebel.codes/about",
		},
	],
};

const articleJsonLd = {
	"@context": "https://schema.org",
	"@type": "Article",
	headline: "About NACE-BEL Codes",
	description: aboutDescription,
	url: "https://nacebel.codes/about",
	inLanguage: "en",
	about: [
		{ "@type": "Thing", name: "NACE" },
		{ "@type": "Thing", name: "NACE-BEL" },
		{ "@type": "Thing", name: "Belgian economic activity classification" },
	],
	publisher: {
		"@type": "Organization",
		name: "Ingram Technologies",
		url: "https://ingram.tech",
	},
};

const levels = [
	{
		depth: 2,
		level: "Level 2",
		code: "01",
		title: "Section",
		description: "The broadest practical grouping used in the public directory.",
	},
	{
		depth: 3,
		level: "Level 3",
		code: "01.1",
		title: "Division",
		description: "Adds a more specific economic branch within the section.",
	},
	{
		depth: 4,
		level: "Level 4",
		code: "01.11",
		title: "Group",
		description: "Narrows the activity into a more precise operational category.",
	},
	{
		depth: 5,
		level: "Level 5",
		code: "01.111",
		title: "Class",
		description: "The most specific level published in this directory.",
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
			<script
				type="application/ld+json"
				// oxlint-disable-next-line react/no-danger -- JSON-LD payload
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<script
				type="application/ld+json"
				// oxlint-disable-next-line react/no-danger -- JSON-LD payload
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>
			<div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:py-12">
				<header className="border-b border-border pb-8">
					<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
						About NACE-BEL Codes
					</h1>
					<p className="measure mt-3 text-lg text-muted-foreground">
						NACE and NACE-BEL classify economic activity in Belgium and
						across Europe.
					</p>
				</header>

				<section className="grid gap-6 lg:grid-cols-2">
					<article className="rounded-lg border border-border bg-card p-6 sm:p-8">
						<h2 className="font-bold text-3xl tracking-tight">
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
					<article className="rounded-lg border border-border bg-card p-6 sm:p-8">
						<h2 className="font-bold text-3xl tracking-tight">
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

				<section className="rounded-lg border border-border bg-card p-6 sm:p-8">
					<div className="space-y-3">
						<h2 className="font-bold text-3xl tracking-tight">
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
								className="rounded-lg border border-border bg-muted/40 p-5"
							>
								<div className="flex items-center justify-between gap-4">
									<span
										className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium"
										style={{
											color: `var(--color-level-${item.depth})`,
											borderColor: `var(--color-level-${item.depth})`,
										}}
									>
										{item.level}
									</span>
									<code className="rounded border border-border bg-muted px-2 py-0.5 text-sm">
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
					<article className="rounded-lg border border-border bg-card p-6 sm:p-8">
						<h2 className="font-bold text-3xl tracking-tight">
							NACE-BEL versions
						</h2>
						<div className="mt-6 space-y-4">
							{versions.map((version) => (
								<div
									key={version.title}
									className="rounded-lg border border-border bg-muted/40 p-5"
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
					<article className="rounded-lg border border-border bg-card p-6 sm:p-8">
						<h2 className="font-bold text-3xl tracking-tight">
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
						<div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-5">
							<p className="text-sm leading-7 text-primary/80">
								The main idea is simple: everyone uses the same
								structure, so analysis, reporting, and administration
								stay consistent.
							</p>
						</div>
					</article>
				</section>

				<section className="rounded-lg border border-border bg-card p-6 sm:p-8">
					<div className="space-y-3">
						<h2 className="font-bold text-3xl tracking-tight">
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
								className="rounded-lg border border-border bg-muted/40 p-5"
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

				<section className="rounded-lg border border-primary/20 bg-primary/5 p-6 sm:p-8">
					<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
						<div className="space-y-4">
							<h2 className="font-bold text-3xl tracking-tight text-primary">
								Finding the right code
							</h2>
							<p className="text-primary/80">
								The best code is the one that reflects the main activity
								of the business. If you are unsure, use the search
								directory to explore related activities and cross-check
								against official Belgian guidance.
							</p>
							<div className="flex flex-wrap gap-3">
								<Button render={<a href="/">Start searching</a>} />
								<Button
									variant="outline"
									render={
										<a href="mailto:contact@nacebel.codes">
											Contact us
										</a>
									}
								/>
							</div>
						</div>
						<div className="rounded-lg border border-primary/15 bg-card p-5 shadow-sm">
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
