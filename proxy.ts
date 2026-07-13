import { codeHrefFor, loadCodeData } from "@/lib/code-page";
import type { Locale } from "@/lib/i18n/locales";
import { type NextRequest, NextResponse } from "next/server";

const LOCALE_PREFIX_RE = /^\/(en|nl|fr|de)(\/|$)/;
const CANONICAL_ONLY_PATHS = new Set(["/", "/about", "/api/docs"]);
// Codes are numeric (e.g. 01.11) or a single section letter (e.g. A).
const CODE_PATH_RE = /^\/(en|nl|fr|de)\/([A-Za-z]|[\d.]+)(?:\/([^/]*))?\/?$/;

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const localeMatch = pathname.match(LOCALE_PREFIX_RE);
	const locale = localeMatch?.[1];
	if (locale) {
		const rest = pathname.slice(locale.length + 1) || "/";

		if (CANONICAL_ONLY_PATHS.has(rest)) {
			const url = request.nextUrl.clone();
			url.pathname = rest;

			const response = NextResponse.redirect(url, 302);
			response.cookies.set("locale", locale, {
				path: "/",
				maxAge: 60 * 60 * 24 * 365,
				sameSite: "lax",
			});
			return response;
		}
	}

	const codeMatch = pathname.match(CODE_PATH_RE);
	if (codeMatch) {
		const [, locale, code] = codeMatch;
		if (!locale || !code) {
			return NextResponse.next();
		}
		const data = await loadCodeData(code.replace(/\./g, ""));
		if (!data) {
			return new NextResponse("Not Found", {
				status: 404,
				headers: { "Content-Type": "text/plain; charset=utf-8" },
			});
		}
		const canonical = codeHrefFor(data, locale as Locale);
		if (pathname !== canonical) {
			const url = request.nextUrl.clone();
			url.pathname = canonical;
			return NextResponse.redirect(url, 308);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|static).*)"],
};
