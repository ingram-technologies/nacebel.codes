import { negotiateAcceptLanguage } from "@ingram-tech/nk-i18n";
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

	const acceptLanguage = (await headers()).get("accept-language");
	const negotiated = negotiateAcceptLanguage(acceptLanguage, SUPPORTED_LOCALES);
	if (negotiated && isLocale(negotiated)) return negotiated;

	return DEFAULT_LOCALE;
}

export const resolveLocale = cache(resolveLocaleImpl);
