import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/contexts/locale-context";
import { createT } from "@/lib/i18n/core";
import { HTML_LANG, OG_LOCALE } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { siteScope } from "@/lib/i18n/scopes/site";
import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import type React from "react";

const manrope = Manrope({
	subsets: ["latin"],
	variable: "--font-sans",
});

const newsreader = Newsreader({
	subsets: ["latin"],
	variable: "--font-display",
});

const siteName = "NACE-BEL 2025 Codes";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await resolveLocale();
	const t = createT(locale, siteScope);
	const description = t(
		"Search the full NACE-BEL 2025 classification of Belgian economic activity codes in Dutch, French, English, and German. Browse the directory, copy codes, or use the free public API.",
	);

	return {
		metadataBase: new URL("https://nacebel.codes"),
		title: {
			default: siteName,
			template: "%s | NACE-BEL 2025 Codes",
		},
		description,
		applicationName: siteName,
		keywords: [
			"NACE-BEL",
			"NACE-BEL 2025",
			"NACEBEL",
			"NACE codes",
			"Belgian economic activity codes",
			"NACE Rev. 2.1",
			"KBO NACE",
			"Belgium business classification",
			"economic activity codes",
		],
		category: "reference",
		authors: [{ name: "Ingram Technologies", url: "https://ingram.tech" }],
		creator: "Ingram Technologies",
		publisher: "Ingram Technologies",
		formatDetection: {
			email: false,
			telephone: false,
			address: false,
		},
		alternates: {
			canonical: "/",
		},
		openGraph: {
			title: siteName,
			description,
			url: "https://nacebel.codes",
			siteName,
			locale: OG_LOCALE[locale],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: siteName,
			description,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-snippet": -1,
				"max-image-preview": "large",
			},
		},
	};
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0b1120" },
	],
	colorScheme: "light dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const locale = await resolveLocale();

	return (
		<html lang={HTML_LANG[locale]} suppressHydrationWarning>
			<head>
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title="NACE-BEL 2025 Codes"
					href="/opensearch.xml"
				/>
			</head>
			<body
				className={`${manrope.variable} ${newsreader.variable} min-h-screen bg-background text-foreground antialiased`}
			>
				<LocaleProvider value={locale}>
					{children}
					<Toaster />
				</LocaleProvider>
			</body>
		</html>
	);
}
