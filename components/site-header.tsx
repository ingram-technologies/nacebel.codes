"use client";

import { useEffect, useState } from "react";

import { AdvertisementBanner } from "@/components/advertisement-banner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translations";
import type { Language, Theme } from "@/types";

interface SiteHeaderProps {
	title: string;
	subtitle: string;
	language?: Language;
	onLanguageChange?: (language: Language) => void;
	theme?: Theme;
	onThemeChange?: (theme: Theme) => void;
}

function getCookieValue(name: string) {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${name}=`))
		?.split("=")[1];
}

export function SiteHeader({
	title,
	subtitle,
	language,
	onLanguageChange,
	theme,
	onThemeChange,
}: SiteHeaderProps) {
	const isLanguageControlled =
		language !== undefined && onLanguageChange !== undefined;
	const isThemeControlled = theme !== undefined && onThemeChange !== undefined;

	const [internalLanguage, setInternalLanguage] = useState<Language>("en");
	const [internalTheme, setInternalTheme] = useState<Theme>("system");

	useEffect(() => {
		if (isLanguageControlled) {
			return;
		}

		const storedLanguage = getCookieValue("lang");
		if (storedLanguage && ["en", "de", "fr", "nl"].includes(storedLanguage)) {
			setInternalLanguage(storedLanguage as Language);
		}
	}, [isLanguageControlled]);

	useEffect(() => {
		if (isThemeControlled) {
			return;
		}

		const storedTheme = getCookieValue("theme") as Theme | undefined;
		if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
			setInternalTheme(storedTheme);
		}
	}, [isThemeControlled]);

	useEffect(() => {
		if (isThemeControlled) {
			return;
		}

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

		applyCurrentTheme(internalTheme);
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			if (internalTheme === "system") {
				applyCurrentTheme("system");
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [internalTheme, isThemeControlled]);

	const resolvedLanguage = language ?? internalLanguage;
	const resolvedTheme = theme ?? internalTheme;
	const t = translations[resolvedLanguage];

	const handleLanguageChange = (nextLanguage: Language) => {
		if (onLanguageChange) {
			onLanguageChange(nextLanguage);
			return;
		}

		setInternalLanguage(nextLanguage);
		document.cookie = `lang=${nextLanguage};path=/;max-age=31536000;samesite=lax`;
	};

	const handleThemeChange = (nextTheme: Theme) => {
		if (onThemeChange) {
			onThemeChange(nextTheme);
			return;
		}

		setInternalTheme(nextTheme);
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<AdvertisementBanner
				label={t.recommendationLabel}
				text={t.recommendationText}
				cta={t.recommendationCta}
			/>

			<header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
						{title}
					</h1>
					<p className="text-sm text-muted-foreground">{subtitle}</p>
				</div>
				<div className="flex flex-wrap items-center gap-2 sm:gap-3">
					<Button variant="outline" size="sm" asChild>
						<a href="/about">About</a>
					</Button>
					<Button variant="outline" size="sm" asChild>
						<a href="/api/docs">API Docs</a>
					</Button>
					<div className="flex items-center gap-2 sm:gap-3">
						<ThemeToggle
							theme={resolvedTheme}
							setTheme={handleThemeChange}
							translations={t}
						/>
						<LanguageSwitcher
							language={resolvedLanguage}
							changeLanguage={handleLanguageChange}
						/>
					</div>
				</div>
			</header>
		</div>
	);
}
