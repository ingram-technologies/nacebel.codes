import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	const base = "https://nacebel.codes";

	return [
		{
			url: `${base}/`,
			lastModified,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${base}/about`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${base}/api/docs`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.6,
		},
	];
}
