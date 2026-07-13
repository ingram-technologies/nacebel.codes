import "@/app/globals.css";
import { RootHtml } from "@/components/root-html";
import { type Locale, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { buildRootMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export { viewport } from "@/lib/site-metadata";

// Static root layout for the `/[locale]/…` subtree: locale comes from the URL,
// so these pages prerender with a correct `<html lang>` and no request access.
export function generateStaticParams(): { locale: string }[] {
	return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

function isLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return isLocale(locale) ? buildRootMetadata(locale) : {};
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return <RootHtml locale={locale}>{children}</RootHtml>;
}
