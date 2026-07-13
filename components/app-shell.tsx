import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/contexts/locale-context";
import type { Locale } from "@/lib/i18n/locales";

/**
 * The shared page chrome (locale context, header, promo banner, toaster) that
 * both root layouts render around their content. Kept locale-agnostic beyond
 * the `locale` prop so the static `[locale]` layout can pass the URL locale and
 * the dynamic `(site)` layout can pass the negotiated one.
 */
export function AppShell({
	locale,
	children,
}: {
	locale: Locale;
	children: ReactNode;
}) {
	return (
		<LocaleProvider value={locale}>
			<SiteHeader />
			<a
				href="https://financica.app"
				target="_blank"
				rel="noopener"
				className="group block border-b border-border bg-primary/[0.06] transition-colors hover:bg-primary/10"
			>
				<div className="container flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 py-2 text-center text-sm">
					<span className="text-muted-foreground">
						Looking for a better accounting solution?{" "}
						<span className="font-medium text-foreground">Financica</span>{" "}
						offers AI-native bookkeeping — 3 months free.
					</span>
					<span className="inline-flex items-center gap-1 font-medium text-primary">
						financica.app
						<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</span>
				</div>
			</a>
			{children}
			<Toaster />
		</LocaleProvider>
	);
}
