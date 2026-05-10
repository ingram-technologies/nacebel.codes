import { cache } from "react";
import type { Locale } from "./i18n/locales";
import { getNacebelAncestors, getNacebelCodeDetails } from "./nacebelData";
import { slugify } from "./slug";

export type CodeData = NonNullable<Awaited<ReturnType<typeof getNacebelCodeDetails>>>;

export const loadCodeData = cache(async (codeWithoutDots: string) => {
	return getNacebelCodeDetails(codeWithoutDots);
});

export const loadAncestors = cache(async (codeWithoutDots: string) => {
	return getNacebelAncestors(codeWithoutDots);
});

export function codeTitleFor(data: CodeData, locale: Locale): string {
	return data.titles[locale] || data.titles.en || data.code;
}

export function codeSlugFor(data: CodeData, locale: Locale): string {
	return slugify(codeTitleFor(data, locale)) || "code";
}

export function codeHrefFor(data: CodeData, locale: Locale): string {
	return `/${locale}/${data.code}/${codeSlugFor(data, locale)}`;
}
