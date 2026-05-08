"use client";

import { usePathname } from "next/navigation";
import { HTML_LANG, SUPPORTED_LOCALES } from "@/lib/i18n/locales";

const SITE_URL = "https://nacebel.codes";

export function HreflangLinks() {
	const pathname = usePathname();
	const path = pathname === "/" ? "" : pathname;

	return (
		<>
			{SUPPORTED_LOCALES.map((loc) => (
				<link
					key={loc}
					rel="alternate"
					hrefLang={HTML_LANG[loc]}
					href={`${SITE_URL}/${loc}${path}`}
				/>
			))}
			<link
				rel="alternate"
				hrefLang="x-default"
				href={`${SITE_URL}${pathname}`}
			/>
		</>
	);
}
