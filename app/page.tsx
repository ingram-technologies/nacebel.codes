import NacebelSearchClient from "@/components/nacebel-search";
import { createT } from "@/lib/i18n/core";
import { HTML_LANG, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { siteScope } from "@/lib/i18n/scopes/site";
import { getPaginatedNacebelCodes } from "@/lib/nacebelData";
import type { Metadata } from "next";
import { Suspense } from "react";

const HOME_LANGUAGES: Record<string, string> = {
	"x-default": "https://nacebel.codes/",
};
for (const loc of SUPPORTED_LOCALES) {
	HOME_LANGUAGES[HTML_LANG[loc]] = `https://nacebel.codes/${loc}/`;
}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await resolveLocale();
	const t = createT(locale, siteScope);
	const metaTitle = t("NACE-BEL 2025 Codes — Search the Belgian classification");
	const metaDescription = t(
		"Search the full NACE-BEL 2025 classification of Belgian economic activity codes in Dutch, French, English, and German. Browse the directory, copy codes, or use the free public API.",
	);

	return {
		title: { absolute: metaTitle },
		description: metaDescription,
		alternates: { canonical: "/", languages: HOME_LANGUAGES },
		openGraph: {
			title: metaTitle,
			description: metaDescription,
			url: "https://nacebel.codes",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: metaTitle,
			description: metaDescription,
		},
	};
}

const websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "NACE-BEL 2025 Codes",
	alternateName: "NACEBEL 2025",
	url: "https://nacebel.codes",
	inLanguage: ["en", "nl", "fr", "de"],
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
	url: "https://nacebel.codes",
	inLanguage: ["nl", "fr", "en", "de"],
	keywords: ["NACE-BEL", "NACE", "economic activity", "Belgium", "classification"],
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
				// oxlint-disable-next-line react/no-danger -- JSON-LD payload, not user input
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
			/>
			<script
				type="application/ld+json"
				// oxlint-disable-next-line react/no-danger -- JSON-LD payload, not user input
				dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
			/>
			<main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
				<Suspense>
					<NacebelSearchClient initialCodes={initialCodes} />
				</Suspense>
			</main>
		</div>
	);
}
