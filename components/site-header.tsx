"use client";

import { useEffect, useState } from "react";

import { AdvertisementBanner } from "@/components/advertisement-banner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { siteScope } from "@/lib/i18n/scopes/site";
import type { Theme } from "@/types";

interface SiteHeaderProps {
	title?: string;
	subtitle?: string;
}

function getCookieValue(name: string) {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${name}=`))
		?.split("=")[1];
}

export function SiteHeader({ title, subtitle }: SiteHeaderProps) {
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
		<div className="space-y-5 sm:space-y-6">
			<AdvertisementBanner
				label={t("Recommendation from the team")}
				text={t(
					"Need to incorporate a Belgian company? Beldoc handles it online with a cleaner, lower-friction flow.",
				)}
				cta={t("Visit beldoc.be")}
			/>

			<header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="space-y-1">
					{title ? (
						<h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							{title}
						</h1>
					) : null}
					{subtitle ? (
						<p className="text-sm text-muted-foreground">{subtitle}</p>
					) : null}
				</div>
				<div className="flex flex-wrap items-center gap-2 sm:gap-3">
					<Button
						variant="outline"
						size="sm"
						render={<a href="/about">About</a>}
					/>
					<Button
						variant="outline"
						size="sm"
						render={<a href="/api/docs">API Docs</a>}
					/>
					<div className="flex items-center gap-2 sm:gap-3">
						<ThemeToggle theme={theme} setTheme={setTheme} />
						<LanguageSwitcher />
					</div>
				</div>
			</header>
		</div>
	);
}
