import { HTML_LANG, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import type { MetadataRoute } from "next";

const base = "https://nacebel.codes";

const routes = [
	{ path: "/", changeFrequency: "weekly" as const, priority: 1 },
	{ path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
	{ path: "/api/docs", changeFrequency: "monthly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	return routes.map((route) => {
		const url = `${base}${route.path}`;
		const languages: Record<string, string> = {
			"x-default": url,
		};
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
}
