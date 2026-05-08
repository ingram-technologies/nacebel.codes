import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/v1/"],
			},
		],
		sitemap: "https://nacebel.codes/sitemap.xml",
		host: "https://nacebel.codes",
	};
}
