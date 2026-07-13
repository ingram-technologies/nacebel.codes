"use client";

import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/contexts/locale-context";
import { useT } from "@/lib/i18n";
import { siteScope } from "@/lib/i18n/scopes/site";
import type { Theme } from "@/types";

function getCookieValue(name: string) {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${name}=`))
		?.split("=")[1];
}

export function SiteHeader() {
	const locale = useLocale();
	const t = useT(siteScope);
	const [theme, setTheme] = useState<Theme>("system");

	useEffect(() => {
		const storedTheme = getCookieValue("theme") as Theme | undefined;
		if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
			setTheme(storedTheme);
		}
	}, []);

	useEffect(() => {
		const applyCurrentTheme = (currentTheme: Theme) => {
			document.cookie = `theme=${currentTheme};path=/;max-age=31536000;samesite=lax`;
			if (currentTheme === "light") {
				document.documentElement.classList.remove("dark");
			} else if (currentTheme === "dark") {
				document.documentElement.classList.add("dark");
			} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};

		applyCurrentTheme(theme);
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			if (theme === "system") {
				applyCurrentTheme("system");
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	return (
		<header className="sticky top-0 z-[1100] border-b border-border bg-card">
			<div className="container flex h-14 items-center justify-between gap-4">
				<a
					href={`/${locale}`}
					className="group inline-flex items-center gap-2 text-[1.05rem] leading-none font-bold tracking-tight"
					aria-label={t("nacebel.codes — home")}
				>
					<span
						aria-hidden
						className="grid size-6 place-items-center rounded bg-primary font-mono text-[0.7rem] font-bold text-primary-foreground"
					>
						NB
					</span>
					<span>
						nacebel<span className="text-primary">.codes</span>
					</span>
				</a>

				<nav className="flex items-center gap-1 sm:gap-2">
					<a
						href={`/${locale}/about`}
						className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3"
					>
						{t("About")}
					</a>
					<a
						href={`/${locale}/api/docs`}
						className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3"
					>
						{t("API")}
					</a>
					<span className="mx-1 hidden h-5 w-px bg-border sm:block" />
					<ThemeToggle theme={theme} setTheme={setTheme} />
					<LanguageSwitcher />
				</nav>
			</div>
		</header>
	);
}
