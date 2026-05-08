import { type NextRequest, NextResponse } from "next/server";

const LOCALE_PREFIX_RE = /^\/(en|nl|fr|de)(\/|$)/;
const CANONICAL_ONLY_PATHS = new Set(["/", "/about", "/api/docs"]);

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const localeMatch = pathname.match(LOCALE_PREFIX_RE);
	if (localeMatch) {
		const locale = localeMatch[1]!;
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

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|static).*)"],
};
