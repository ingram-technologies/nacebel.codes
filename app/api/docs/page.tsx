import { CodeBlock } from "@/components/code-block";
import { PageFooter } from "@/components/page-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "API Documentation",
	description:
		"Public API documentation for the NACE-BEL 2025 classification system.",
	openGraph: {
		title: "API Documentation - NACE-BEL 2025",
		description:
			"Public API documentation for the NACE-BEL 2025 classification system.",
		type: "website",
	},
};

const listResponseExample = `{
  "data": [
    {
      "level": 2,
      "code": "01.1",
      "titles": {
        "en": "Growing of non-perennial crops",
        "de": "Anbau von einjahrigen Pflanzen",
        "fr": "Cultures non permanentes",
        "nl": "Teelt van eenjarige gewassen"
      },
      "description": { "en": "", "de": "", "fr": "", "nl": "" }
    }
  ],
  "totalPages": 25,
  "totalItems": 2458
}`;

const detailResponseExample = `{
  "level": 4,
  "code": "01.11",
  "titles": {
    "en": "Growing of cereals (except rice), leguminous crops and oil seeds",
    "de": "Anbau von Getreide (ohne Reis), Hulsenfruchten und Olsaaten",
    "fr": "Culture de cereales (a l'exception du riz), de legumineuses et de graines oleagineuses",
    "nl": "Teelt van granen (met uitzondering van rijst), peulgewassen en oliehoudende zaden"
  },
  "description": { "en": "", "de": "", "fr": "", "nl": "" },
  "childrenCodes": [
    "01.111",
    "01.112",
    "01.113",
    "01.119"
  ]
}`;

const notFoundResponseExample = `{
  "error": "NACEBEL code not found."
}`;

const queryParameters = [
	{
		name: "q",
		type: "string",
		description: "Search query for a code or title. Omit it to list the directory.",
	},
	{
		name: "page",
		type: "number",
		description: "Page number for pagination. Default: 1.",
	},
	{
		name: "limit",
		type: "number",
		description: "Items per page. Default: 100. Maximum: 500.",
	},
	{
		name: "level",
		type: "number",
		description: "Minimum NACE-BEL level to include, from 2 to 5.",
	},
];

const endpointCards = [
	{
		title: "List and search codes",
		path: "/api/v1/nacebel-codes/2025",
		description:
			"Retrieve paginated codes or search titles and code numbers across the public directory.",
		request: `curl "https://nacebel.codes/api/v1/nacebel-codes/2025?q=software&level=4"`,
		response: listResponseExample,
	},
	{
		title: "Get code details",
		path: "/api/v1/nacebel-codes/2025/{id}",
		description:
			"Fetch one code by its dot-less identifier and include its direct children.",
		request: `curl "https://nacebel.codes/api/v1/nacebel-codes/2025/0111"`,
		response: detailResponseExample,
	},
];

export default function ApiDocsPage() {
	return (
		<div className="bg-background text-foreground">
			<div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:py-12">
				<SiteHeader
					title="NACE-BEL 2025 API"
					subtitle="Public API documentation for search and lookup across the NACE-BEL 2025 directory."
				/>

				<section className="grid gap-3 sm:grid-cols-3">
					<div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
						<p className="text-sm text-muted-foreground">Endpoints</p>
						<p className="mt-2 text-2xl font-semibold">2</p>
						<p className="mt-1 text-sm text-muted-foreground">
							List/search and detail lookup
						</p>
					</div>
					<div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
						<p className="text-sm text-muted-foreground">Max page size</p>
						<p className="mt-2 text-2xl font-semibold">500</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Good for bulk reads and exports
						</p>
					</div>
					<div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
						<p className="text-sm text-muted-foreground">Authentication</p>
						<p className="mt-2 text-2xl font-semibold">None</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Contact us for higher limits and support
						</p>
					</div>
				</section>

				<section className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
					<div className="space-y-4">
						<h2 className="font-display text-3xl tracking-tight">
							Base URL and authentication
						</h2>
						<p className="text-muted-foreground">
							Requests are public. You do not need to send an
							<code className="rounded bg-muted px-1.5 py-0.5 text-sm">
								Authorization
							</code>{" "}
							header.
						</p>
						<CodeBlock>{`https://nacebel.codes/api/v1/nacebel-codes/2025`}</CodeBlock>
					</div>
				</section>

				<section className="space-y-6 rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
					<div className="space-y-2">
						<h2 className="font-display text-3xl tracking-tight">
							Query parameters
						</h2>
						<p className="text-muted-foreground">
							The list endpoint supports paging, search, and level
							filtering.
						</p>
					</div>
					<div className="overflow-hidden rounded-[1.5rem] border border-border/70">
						<table className="w-full text-left text-sm">
							<thead className="bg-muted/70">
								<tr>
									<th className="px-4 py-3 font-semibold">
										Parameter
									</th>
									<th className="px-4 py-3 font-semibold">Type</th>
									<th className="px-4 py-3 font-semibold">
										Description
									</th>
								</tr>
							</thead>
							<tbody className="bg-background/75">
								{queryParameters.map((parameter) => (
									<tr
										key={parameter.name}
										className="border-t border-border/70"
									>
										<td className="px-4 py-3 font-mono text-sm">
											{parameter.name}
										</td>
										<td className="px-4 py-3 font-mono text-sm">
											{parameter.type}
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{parameter.description}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section className="space-y-6">
					{endpointCards.map((endpoint) => (
						<div
							key={endpoint.path}
							className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8"
						>
							<div className="space-y-4">
								<div className="flex flex-wrap items-center gap-3">
									<Badge className="border-emerald-600/20 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-200">
										GET
									</Badge>
									<code className="rounded-full border border-border/70 bg-background/75 px-4 py-2 text-sm">
										{endpoint.path}
									</code>
								</div>
								<div>
									<h3 className="text-2xl font-semibold tracking-tight">
										{endpoint.title}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{endpoint.description}
									</p>
								</div>
								<div className="space-y-3">
									<p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
										Example request
									</p>
									<CodeBlock>{endpoint.request}</CodeBlock>
								</div>
								<div className="space-y-3">
									<p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
										Example response
									</p>
									<CodeBlock>{endpoint.response}</CodeBlock>
								</div>
							</div>
						</div>
					))}
				</section>

				<section className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
					<div className="space-y-4">
						<h2 className="font-display text-3xl tracking-tight">
							Errors and throttling
						</h2>
						<p className="text-muted-foreground">
							The API returns standard HTTP status codes. If you request a
							missing code, you will receive a
							<code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">
								404
							</code>
							response.
						</p>
						<CodeBlock>{notFoundResponseExample}</CodeBlock>
						<p className="text-muted-foreground">
							Public traffic is served on shared infrastructure. Excessive
							usage may be throttled with
							<code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">
								429 Too Many Requests
							</code>
							to protect the service.
						</p>
					</div>
				</section>

				<section className="rounded-[2rem] border border-primary/15 bg-primary/10 p-6 shadow-[0_24px_70px_-50px_rgba(30,64,175,0.45)] sm:p-8">
					<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
						<div className="space-y-4">
							<h2 className="font-display text-3xl tracking-tight text-primary">
								Need higher rate limits or support?
							</h2>
							<p className="max-w-2xl text-primary/80">
								The public API is available as-is. If you need heavier
								sustained usage, operational support, or a more tailored
								integration path, email us and we can work out a setup.
							</p>
							<div className="flex flex-wrap gap-3">
								<Button asChild>
									<a href="mailto:contact@nacebel.codes?subject=NACE-BEL%20API">
										Contact us
									</a>
								</Button>
								<Button variant="outline" asChild>
									<a href="/">Try the search UI</a>
								</Button>
							</div>
						</div>
						<div className="rounded-[1.5rem] border border-primary/15 bg-background/85 p-5 shadow-sm">
							<p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
								Typical reasons to reach out
							</p>
							<ul className="mt-4 space-y-3 text-sm text-muted-foreground">
								<li>Higher sustained request volume</li>
								<li>Priority issue resolution</li>
								<li>Integration guidance for production use</li>
								<li>Commercial or custom data access questions</li>
							</ul>
						</div>
					</div>
				</section>

				<PageFooter />
			</div>
		</div>
	);
}
