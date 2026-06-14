import { NacebelCodeDetail } from "@/components/nacebel-code-detail";
import {
	codeHrefFor,
	codeTitleFor,
	loadAncestors,
	loadCodeData,
} from "@/lib/code-page";
import { createT } from "@/lib/i18n/core";
import {
	HTML_LANG,
	OG_LOCALE,
	SUPPORTED_LOCALES,
	type Locale,
} from "@/lib/i18n/locales";
import { siteScope } from "@/lib/i18n/scopes/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ locale: string; code: string; slug: string }>;
}

function isLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale, code } = await params;
	if (!isLocale(locale)) return {};

	const data = await loadCodeData(code.replace(/\./g, ""));
	if (!data) return {};

	const t = createT(locale, siteScope);
	const title = codeTitleFor(data, locale);
	const description = t(
		"NACE-BEL 2025 code {code} — {title}. Activity classification used by Belgian businesses for registration, tax, and statistics.",
		{ code: data.code, title },
	);
	const canonicalPath = codeHrefFor(data, locale);

	const languages: Record<string, string> = {};
	for (const loc of SUPPORTED_LOCALES) {
		languages[HTML_LANG[loc]] = `https://nacebel.codes${codeHrefFor(data, loc)}`;
	}
	languages["x-default"] = `https://nacebel.codes${codeHrefFor(data, "en")}`;

	return {
		title: { absolute: `${data.code} ${title} | NACE-BEL 2025` },
		description,
		alternates: {
			canonical: canonicalPath,
			languages,
		},
		openGraph: {
			title: `${data.code} ${title}`,
			description,
			url: `https://nacebel.codes${canonicalPath}`,
			locale: OG_LOCALE[locale],
			type: "article",
		},
		twitter: {
			card: "summary",
			title: `${data.code} ${title}`,
			description,
		},
	};
}

export default async function CodePage({ params }: PageProps) {
	const { locale, code } = await params;
	if (!isLocale(locale)) notFound();

	const data = await loadCodeData(code.replace(/\./g, ""));
	if (!data) notFound();

	const canonicalPath = codeHrefFor(data, locale);
	const codeWithoutDots = data.code.replace(/\./g, "");
	const [ancestors, childrenData] = await Promise.all([
		loadAncestors(codeWithoutDots),
		Promise.all(
			(data.childrenCodes ?? []).map((c) => loadCodeData(c.replace(/\./g, ""))),
		),
	]);
	const childCodes = childrenData.filter(
		(c): c is NonNullable<typeof c> => c !== null,
	);

	const t = createT(locale, siteScope);
	const title = codeTitleFor(data, locale);
	const breadcrumbItems = [
		{
			"@type": "ListItem" as const,
			position: 1,
			name: t("NACE-BEL 2025 Codes"),
			item: "https://nacebel.codes/",
		},
		...ancestors.map((ancestor, index) => ({
			"@type": "ListItem" as const,
			position: index + 2,
			name: `${ancestor.code} ${codeTitleFor(ancestor, locale)}`,
			item: `https://nacebel.codes${codeHrefFor(ancestor, locale)}`,
		})),
		{
			"@type": "ListItem" as const,
			position: ancestors.length + 2,
			name: `${data.code} ${title}`,
			item: `https://nacebel.codes${canonicalPath}`,
		},
	];

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: breadcrumbItems,
	};

	const definedTermJsonLd = {
		"@context": "https://schema.org",
		"@type": "DefinedTerm",
		"@id": `https://nacebel.codes${canonicalPath}`,
		name: title,
		alternateName: data.code,
		termCode: data.code,
		url: `https://nacebel.codes${canonicalPath}`,
		inLanguage: HTML_LANG[locale],
		inDefinedTermSet: {
			"@type": "DefinedTermSet",
			name: "NACE-BEL 2025",
			url: "https://nacebel.codes/",
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				// oxlint-disable-next-line react/no-danger -- JSON-LD payload
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<script
				type="application/ld+json"
				// oxlint-disable-next-line react/no-danger -- JSON-LD payload
				dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
			/>
			<NacebelCodeDetail
				data={data}
				locale={locale}
				ancestors={ancestors}
				childCodes={childCodes}
			/>
		</>
	);
}
