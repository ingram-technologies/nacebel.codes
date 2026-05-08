export type Locale = "en" | "nl" | "fr" | "de";

export const SUPPORTED_LOCALES: Locale[] = ["en", "nl", "fr", "de"];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
	en: "English",
	nl: "Nederlands",
	fr: "Français",
	de: "Deutsch",
};

export const HTML_LANG: Record<Locale, string> = {
	en: "en",
	nl: "nl-BE",
	fr: "fr-BE",
	de: "de",
};

export const OG_LOCALE: Record<Locale, string> = {
	en: "en_US",
	nl: "nl_BE",
	fr: "fr_BE",
	de: "de_DE",
};
