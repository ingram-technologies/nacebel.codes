"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/lib/translations";
import type { Language, NacebelCode, Theme } from "@/types";
import { Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AdvertisementBanner } from "./advertisement-banner";
import { LanguageSwitcher } from "./language-switcher";
import { NacebelCodeList } from "./nacebel-code-list";
import { PageFooter } from "./page-footer";
import { PaginationControls } from "./pagination-controls";
import { SearchInput } from "./search-input";
import { ThemeToggle } from "./theme-toggle";

// Helper function to remove punctuation for search optimization
function removePunctuationClient(text: string): string {
	if (!text) return "";
	return text.replace(/[^\p{L}\p{N}\s]/gu, "").toLowerCase();
}

interface NacebelSearchClientProps {
	initialCodes: NacebelCode[];
}

export default function NacebelSearchClient({
	initialCodes,
}: NacebelSearchClientProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [nacebelCodes] = useState<NacebelCode[]>(initialCodes);
	const [filteredCodes, setFilteredCodes] = useState<NacebelCode[]>(initialCodes);
	const [language, setLanguage] = useState<Language>("en");
	const [copiedCode, setCopiedCode] = useState<string | null>(null);
	const [isClientProcessing, setIsClientProcessing] = useState(false);
	const [clientError, setClientError] = useState<string | null>(null);
	const { toast } = useToast();

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(100);
	const [theme, setTheme] = useState<Theme>("system");
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Load initial language from cookie
	useEffect(() => {
		const storedLang = document.cookie
			.split("; ")
			.find((row) => row.startsWith("lang="))
			?.split("=")[1];
		if (storedLang && ["en", "de", "fr", "nl"].includes(storedLang)) {
			setLanguage(storedLang as Language);
		}
	}, []);

	// Load initial theme from cookie or system preference
	useEffect(() => {
		let initialTheme: Theme = "system";
		const storedTheme = document.cookie
			.split("; ")
			.find((row) => row.startsWith("theme="))
			?.split("=")[1] as Theme | undefined;

		if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
			initialTheme = storedTheme;
		}
		setTheme(initialTheme);
	}, []);

	// Apply theme and listen for system changes
	useEffect(() => {
		const applyCurrentTheme = (currentTheme: Theme) => {
			document.cookie = `theme=${currentTheme};path=/;max-age=31536000;samesite=lax`;
			if (currentTheme === "light") {
				document.documentElement.classList.remove("dark");
			} else if (currentTheme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
			}
		};
		applyCurrentTheme(theme);
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			if (theme === "system") applyCurrentTheme("system");
		};
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			const isTextInput =
				target instanceof HTMLInputElement
				|| target instanceof HTMLTextAreaElement
				|| target?.isContentEditable === true;
			const isSlashShortcut =
				event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
			const isCommandShortcut =
				(event.metaKey || event.ctrlKey)
				&& event.key.toLowerCase() === "k"
				&& !event.altKey;

			if (!isSlashShortcut && !isCommandShortcut) {
				return;
			}

			if (isTextInput && target !== searchInputRef.current) {
				if (!isCommandShortcut) {
					return;
				}
			}

			event.preventDefault();
			searchInputRef.current?.focus();
			searchInputRef.current?.select();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Filter codes based on search term
	useEffect(() => {
		setIsClientProcessing(true);
		setClientError(null);
		try {
			const searchableSearchTerm = removePunctuationClient(searchTerm);
			if (searchableSearchTerm === "") {
				setFilteredCodes(nacebelCodes);
			} else {
				const results = nacebelCodes.filter(
					(code) =>
						removePunctuationClient(code.code).includes(
							searchableSearchTerm,
						)
						|| removePunctuationClient(code.titles[language]).includes(
							searchableSearchTerm,
						),
				);
				setFilteredCodes(results);
			}
			setCurrentPage(1);
		} catch (e) {
			console.error("Error filtering codes:", e);
			setClientError(translations[language].error);
		} finally {
			setIsClientProcessing(false);
		}
	}, [searchTerm, nacebelCodes, language]);

	const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedCodes = useMemo(
		() => filteredCodes.slice(startIndex, endIndex),
		[filteredCodes, startIndex, endIndex],
	);
	const levelCounts = useMemo(
		() =>
			nacebelCodes.reduce<Record<number, number>>((accumulator, code) => {
				accumulator[code.level] = (accumulator[code.level] || 0) + 1;
				return accumulator;
			}, {}),
		[nacebelCodes],
	);

	const copyToClipboard = (code: string, description: string) => {
		navigator.clipboard.writeText(`${code} - ${description}`).then(() => {
			setCopiedCode(code);
			toast({ description: t.copied, duration: 2000 });
			setTimeout(() => setCopiedCode(null), 2000);
		});
	};

	const changeLanguage = (newLanguage: Language) => {
		setLanguage(newLanguage);
		document.cookie = `lang=${newLanguage};path=/;max-age=31536000;samesite=lax`;
	};

	const getExternalLink = (code: string) => {
		const cleanCode = code.replace(/\./g, "");
		return `https://kbopub.economie.fgov.be/kbopub/naceToelichting.html?lang=${language}&nace.code=${cleanCode}&nace.version=2025`;
	};

	const exportToCSV = () => {
		const headers = ["Level", "Code", `Description (${language.toUpperCase()})`];
		const csvContent = [
			headers.join(","),
			...filteredCodes.map((code) =>
				[
					code.level,
					code.code,
					`"${(code.titles[language] || "").replace(/"/g, '""')}"`,
				].join(","),
			),
		].join("\n");

		const blob = new Blob([`\uFEFF${csvContent}`], {
			type: "text/csv;charset=utf-8;",
		});
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `nacebel_codes_${language}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast({
			description: `Exported ${filteredCodes.length} codes to CSV`,
			duration: 3000,
		});
	};

	const t = translations[language];
	const quickStats = [
		{
			label: "Official codes",
			value: nacebelCodes.length.toLocaleString(),
			note: "Full 2025 directory",
		},
		{
			label: "Languages",
			value: "4",
			note: "EN, FR, DE, NL",
		},
		{
			label: "Hierarchy",
			value: "Levels 2-5",
			note: "Browse broad to specific",
		},
	];
	const levelStatLabels = [
		{ level: 2, label: "Sections" },
		{ level: 3, label: "Divisions" },
		{ level: 4, label: "Groups" },
		{ level: 5, label: "Classes" },
	];
	const resultsHeading = searchTerm
		? `Results for "${searchTerm}"`
		: "Browse all NACE-BEL codes";

	if (initialCodes.length === 0 && !isClientProcessing) {
		return (
			<div className="text-center text-red-500 dark:text-red-400">
				{clientError || "Could not load NACEBEL codes."}
			</div>
		);
	}

	return (
		<div className="space-y-8 lg:space-y-10">
			<header className="rounded-[2rem] border border-white/60 bg-white/75 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap items-center gap-2 text-sm">
						<span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/10 px-3 py-1 font-semibold text-primary">
							NACE-BEL 2025
						</span>
						<span className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-1 text-muted-foreground">
							Public API
						</span>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="flex flex-wrap items-center gap-2">
							<Button variant="outline" size="sm" asChild>
								<a href="/about">About</a>
							</Button>
							<Button variant="outline" size="sm" asChild>
								<a href="/api/docs">API Docs</a>
							</Button>
						</div>
						<div className="flex items-center gap-3">
							<ThemeToggle
								theme={theme}
								setTheme={setTheme}
								translations={t}
							/>
							<LanguageSwitcher
								language={language}
								changeLanguage={changeLanguage}
							/>
						</div>
					</div>
				</div>
			</header>

			<section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.7)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8 lg:p-10">
				<div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/15" />
				<div className="absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />
				<div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
					<div className="space-y-6">
						<div className="inline-flex items-center rounded-full border border-border/70 bg-background/75 px-3 py-1 text-sm font-medium text-muted-foreground">
							Official Belgian activity code directory
						</div>
						<div className="space-y-4">
							<h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
								{t.title}
							</h1>
							<p className="max-w-2xl text-balance text-lg leading-8 text-muted-foreground">
								Search the complete classification in English, French,
								Dutch, and German. Copy codes, export the full
								directory, or use the public API directly.
							</p>
						</div>
						<div className="grid gap-3 sm:grid-cols-3">
							{quickStats.map((stat) => (
								<div
									key={stat.label}
									className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur-sm"
								>
									<p className="text-sm text-muted-foreground">
										{stat.label}
									</p>
									<p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
										{stat.value}
									</p>
									<p className="mt-1 text-sm text-muted-foreground">
										{stat.note}
									</p>
								</div>
							))}
						</div>
						<div className="flex flex-wrap gap-2">
							{levelStatLabels.map((item) => (
								<div
									key={item.level}
									className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-sm text-muted-foreground"
								>
									<span className="font-semibold text-foreground">
										{(
											levelCounts[item.level] || 0
										).toLocaleString()}
									</span>
									<span>{item.label}</span>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-[1.75rem] border border-border/70 bg-background/80 p-5 shadow-inner shadow-black/5 backdrop-blur-sm dark:bg-slate-950/50">
						<p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
							Start searching
						</p>
						<div className="mt-4">
							<SearchInput
								ref={searchInputRef}
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								placeholder={t.searchPlaceholder}
								className="max-w-none"
								autoFocus
							/>
						</div>
						<div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
							<span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">
								Try: software
							</span>
							<span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">
								62.01
							</span>
							<span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">
								consulting
							</span>
						</div>
						<div className="mt-6 flex flex-wrap items-center gap-3">
							<Button
								size="lg"
								onClick={exportToCSV}
								className="flex items-center gap-2"
							>
								<Download className="h-4 w-4" />
								<span>{t.exportCsv}</span>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<a href="/api/docs">Open API docs</a>
							</Button>
						</div>
						<div className="mt-6 flex items-center justify-between gap-4 rounded-[1.25rem] border border-border/70 bg-background/75 px-4 py-3">
							<div className="space-y-1">
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
									Shortcut
								</p>
								<p className="text-sm font-medium text-foreground">
									Press / or Ctrl/Cmd+K to focus search
								</p>
							</div>
							<div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
								<kbd className="rounded-full border border-border/70 bg-background px-3 py-1">
									/
								</kbd>
								<kbd className="rounded-full border border-border/70 bg-background px-3 py-1">
									Ctrl
								</kbd>
								<kbd className="rounded-full border border-border/70 bg-background px-3 py-1">
									Cmd
								</kbd>
								<kbd className="rounded-full border border-border/70 bg-background px-3 py-1">
									K
								</kbd>
							</div>
						</div>
					</div>
				</div>
			</section>

			<AdvertisementBanner />

			<section className="rounded-[2rem] border border-white/60 bg-white/78 p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-6">
				<div className="flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
							Directory
						</p>
						<h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
							{resultsHeading}
						</h2>
						<p className="text-sm text-muted-foreground">
							{t.showing} {filteredCodes.length > 0 ? startIndex + 1 : 0}-
							{Math.min(endIndex, filteredCodes.length)} {t.of}{" "}
							{filteredCodes.length.toLocaleString()} {t.codes}
							{totalPages > 1
								&& ` (${t.page} ${currentPage} ${t.of} ${totalPages})`}
						</p>
					</div>
					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						setCurrentPage={setCurrentPage}
						translations={t}
					/>
				</div>

				<div className="mt-6">
					{isClientProcessing && searchTerm ? (
						<div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/60 py-14 text-center text-muted-foreground">
							{t.loading}
						</div>
					) : paginatedCodes.length > 0 ? (
						<NacebelCodeList
							codes={paginatedCodes}
							language={language}
							copiedCode={copiedCode}
							onCopy={copyToClipboard}
							getExternalLink={getExternalLink}
						/>
					) : (
						<div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/60 py-14 text-center text-muted-foreground">
							{t.noCodes}
						</div>
					)}
				</div>

				<div className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-sm text-muted-foreground">
						Official NACE-BEL 2025 directory, searchable locally for fast
						lookup and export.
					</div>
					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						setCurrentPage={setCurrentPage}
						translations={t}
					/>
				</div>
			</section>

			<PageFooter />
		</div>
	);
}
