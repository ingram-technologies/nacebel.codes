import { codeHrefFor } from "@/lib/code-page";
import { hreflangLanguages, SITE_ORIGIN } from "@/lib/i18n/hreflang";
import type { Locale } from "@/lib/i18n/locales";
import { getPaginatedNacebelCodes } from "@/lib/nacebelData";
import type { MetadataRoute } from "next";

const canonicalRoutes = [
	{
		pathFor: (loc: Locale) => `/${loc}/`,
		changeFrequency: "weekly" as const,
		priority: 1,
	},
	{
		pathFor: (loc: Locale) => `/${loc}/about`,
		changeFrequency: "monthly" as const,
		priority: 0.7,
	},
	{
		pathFor: (loc: Locale) => `/${loc}/api/docs`,
		changeFrequency: "monthly" as const,
		priority: 0.6,
	},
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const lastModified = new Date();

	// The bare paths redirect to a locale prefix, so every sitemap URL — and its
	// hreflang set — points at the resolvable per-locale pages (English primary).
	const canonical: MetadataRoute.Sitemap = canonicalRoutes.map((route) => ({
		url: `${SITE_ORIGIN}${route.pathFor("en")}`,
		lastModified,
		changeFrequency: route.changeFrequency,
		priority: route.priority,
		alternates: { languages: hreflangLanguages(route.pathFor) },
	}));

	const { data: allCodes } = await getPaginatedNacebelCodes(1, 100000);

	const codeEntries: MetadataRoute.Sitemap = allCodes.map((code) => ({
		url: `${SITE_ORIGIN}${codeHrefFor(code, "en")}`,
		lastModified,
		changeFrequency: "yearly" as const,
		priority: 0.5,
		alternates: { languages: hreflangLanguages((loc) => codeHrefFor(code, loc)) },
	}));

	return [...canonical, ...codeEntries];
}
