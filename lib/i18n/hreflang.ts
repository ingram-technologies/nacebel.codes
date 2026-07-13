import { HTML_LANG, type Locale, SUPPORTED_LOCALES } from "./locales";

export const SITE_ORIGIN = "https://nacebel.codes";

/**
 * Build the hreflang `alternates.languages` map for a page from a per-locale
 * path function. Every entry — including `x-default` (English) — is a real,
 * locale-prefixed URL that resolves 200 without a redirect, which is what
 * search engines expect from an `hreflang` set.
 */
export function hreflangLanguages(
	pathFor: (locale: Locale) => string,
): Record<string, string> {
	const languages: Record<string, string> = {
		"x-default": `${SITE_ORIGIN}${pathFor("en")}`,
	};
	for (const loc of SUPPORTED_LOCALES) {
		languages[HTML_LANG[loc]] = `${SITE_ORIGIN}${pathFor(loc)}`;
	}
	return languages;
}
