import NacebelSearchClient from "@/components/nacebel-search";
import { getPaginatedNacebelCodes } from "@/lib/nacebelData";
import type { Metadata } from "next";

const description =
	"Search the full NACE-BEL 2025 classification of Belgian economic activity codes in Dutch, French, English, and German. Browse the directory, copy codes, or use the free public API.";

export const metadata: Metadata = {
	title: { absolute: "NACE-BEL 2025 Codes — Search the Belgian classification" },
	description,
	alternates: { canonical: "/" },
	openGraph: {
		title: "NACE-BEL 2025 Codes — Search the Belgian classification",
		description,
		url: "https://nacebel.codes",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "NACE-BEL 2025 Codes — Search the Belgian classification",
		description,
	},
};

const websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "NACE-BEL 2025 Codes",
	alternateName: "NACEBEL 2025",
	url: "https://nacebel.codes",
	inLanguage: ["en", "nl", "fr", "de"],
	description,
	publisher: {
		"@type": "Organization",
		name: "Ingram Technologies",
		url: "https://ingram.tech",
	},
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: "https://nacebel.codes/?q={search_term_string}",
		},
		"query-input": "required name=search_term_string",
	},
};

const datasetJsonLd = {
	"@context": "https://schema.org",
	"@type": "Dataset",
	name: "NACE-BEL 2025 — Belgian economic activity classification",
	alternateName: ["NACE-BEL 2025", "NACEBEL 2025"],
	description,
	url: "https://nacebel.codes",
	inLanguage: ["nl", "fr", "en", "de"],
	keywords: [
		"NACE-BEL",
		"NACE",
		"economic activity",
		"Belgium",
		"classification",
	],
	isAccessibleForFree: true,
	license: "https://nacebel.codes/about",
	creator: {
		"@type": "Organization",
		name: "Ingram Technologies",
		url: "https://ingram.tech",
	},
	distribution: [
		{
			"@type": "DataDownload",
			encodingFormat: "application/json",
			contentUrl: "https://nacebel.codes/api/v1/nacebel-codes/2025",
		},
	],
};

export default async function Home() {
	const { data: initialCodes } = await getPaginatedNacebelCodes(1, 100000);

	return (
		<div className="min-h-screen bg-background">
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload, not user input
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload, not user input
				dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
			/>
			<main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
				<NacebelSearchClient initialCodes={initialCodes} />
			</main>
		</div>
	);
}
