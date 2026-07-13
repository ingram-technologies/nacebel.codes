import "@/app/globals.css";
import { RootHtml } from "@/components/root-html";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildRootMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export { viewport } from "@/lib/site-metadata";

// Dynamic root layout for the locale-prefix-free pages (`/`, `/about`), whose
// locale is negotiated from the cookie / Accept-Language header. Only a couple
// of pages, so on-demand rendering here is fine.
export async function generateMetadata(): Promise<Metadata> {
	return buildRootMetadata(await resolveLocale());
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const locale = await resolveLocale();
	return <RootHtml locale={locale}>{children}</RootHtml>;
}
