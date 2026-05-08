import { codeHrefFor, loadCodeData } from "@/lib/code-page";
import { type Locale, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { notFound, permanentRedirect } from "next/navigation";

function isLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export default async function SluglessCodePage({
	params,
}: {
	params: Promise<{ locale: string; code: string }>;
}) {
	const { locale, code } = await params;
	if (!isLocale(locale)) notFound();

	const data = await loadCodeData(code.replace(/\./g, ""));
	if (!data) notFound();

	permanentRedirect(codeHrefFor(data, locale));
}
