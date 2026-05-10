import { cache } from "react";
import type { Locale } from "./i18n/locales";
import { getNacebelCodeDetails } from "./nacebelData";
import { slugify } from "./slug";

export type CodeData = NonNullable<Awaited<ReturnType<typeof getNacebelCodeDetails>>>;

export const loadCodeData = cache(async (codeWithoutDots: string) => {
	return getNacebelCodeDetails(codeWithoutDots);
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

export function getParentCode(code: string): string | null {
	if (!code.includes(".")) return null;
	const trimmed = code.slice(0, -1);
	return trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
}

export const loadAncestors = cache(async (code: string): Promise<CodeData[]> => {
	const ancestors: CodeData[] = [];
	let candidate = getParentCode(code);
	while (candidate) {
		const data = await loadCodeData(candidate.replace(/\./g, ""));
		if (data) {
			ancestors.unshift(data);
			candidate = getParentCode(data.code);
		} else {
			candidate = getParentCode(candidate);
		}
	}
	return ancestors;
});
