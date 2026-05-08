import { cookies, headers } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES } from "./locales";

function isLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

async function resolveLocaleImpl(): Promise<Locale> {
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get("locale")?.value;
	if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

	const headerStore = await headers();
	const acceptLanguage = headerStore.get("accept-language");
	if (acceptLanguage) {
		for (const part of acceptLanguage.split(",")) {
			const lang = part.split(";")[0]?.trim().split("-")[0]?.toLowerCase();
			if (lang && isLocale(lang)) return lang;
		}
	}

	return DEFAULT_LOCALE;
}

export const resolveLocale = cache(resolveLocaleImpl);
