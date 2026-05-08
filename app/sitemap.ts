import { codeHrefFor } from "@/lib/code-page";
import { HTML_LANG, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { getPaginatedNacebelCodes } from "@/lib/nacebelData";
import type { MetadataRoute } from "next";

const base = "https://nacebel.codes";

const canonicalRoutes = [
	{ path: "/", changeFrequency: "weekly" as const, priority: 1 },
	{ path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
	{ path: "/api/docs", changeFrequency: "monthly" as const, priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const lastModified = new Date();

	const canonical: MetadataRoute.Sitemap = canonicalRoutes.map((route) => {
		const url = `${base}${route.path}`;
		const languages: Record<string, string> = { "x-default": url };
		for (const loc of SUPPORTED_LOCALES) {
			const suffix = route.path === "/" ? "/" : route.path;
			languages[HTML_LANG[loc]] = `${base}/${loc}${suffix}`;
		}
		return {
			url,
			lastModified,
			changeFrequency: route.changeFrequency,
			priority: route.priority,
			alternates: { languages },
		};
	});

	const { data: allCodes } = await getPaginatedNacebelCodes(1, 100000);

	const codeEntries: MetadataRoute.Sitemap = allCodes.map((code) => {
		const enUrl = `${base}${codeHrefFor(code, "en")}`;
		const languages: Record<string, string> = { "x-default": enUrl };
		for (const loc of SUPPORTED_LOCALES) {
			languages[HTML_LANG[loc]] = `${base}${codeHrefFor(code, loc)}`;
		}
		return {
			url: enUrl,
			lastModified,
			changeFrequency: "yearly" as const,
			priority: 0.5,
			alternates: { languages },
		};
	});

	return [...canonical, ...codeEntries];
}
