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
	const exampleSearches = ["software", "62.01", "consulting"];
	const resultsHeading = searchTerm ? `Results for "${searchTerm}"` : "All codes";

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

			<section className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-6">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-2">
							<h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
								{t.title}
							</h1>
							<p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
								Search the official directory, copy codes, export the
								current results, or jump to the public API.
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-3">
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
					</div>

					<AdvertisementBanner />

					<div className="sticky top-3 z-20 -mx-1 rounded-[1.5rem] border border-border/70 bg-background/92 p-3 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.6)] backdrop-blur-xl dark:bg-slate-950/85 sm:-mx-2 sm:px-4">
						<div className="flex flex-col gap-3 lg:flex-row lg:items-center">
							<SearchInput
								ref={searchInputRef}
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								placeholder={t.searchPlaceholder}
								className="max-w-none flex-1"
								autoFocus
							/>
							<div className="flex flex-wrap items-center gap-3">
								<Button variant="outline" size="lg" asChild>
									<a href="/api/docs">Open API docs</a>
								</Button>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
						<span className="font-medium">Try:</span>
						{exampleSearches.map((example) => (
							<button
								key={example}
								type="button"
								onClick={() => setSearchTerm(example)}
								className="rounded-full border border-border/70 bg-background/70 px-3 py-1 transition-colors hover:border-primary/25 hover:text-foreground"
							>
								{example}
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="rounded-[2rem] border border-white/60 bg-white/78 p-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-5">
				<div className="flex flex-col gap-3 border-b border-border/60 pb-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
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
					<div className="flex flex-wrap items-center gap-3 lg:justify-end">
						<Button
							variant="outline"
							size="sm"
							onClick={exportToCSV}
							className="flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							<span>{t.exportCsv}</span>
						</Button>
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							setCurrentPage={setCurrentPage}
							translations={t}
							className="justify-start sm:justify-end"
						/>
					</div>
				</div>

				<div className="mt-4">
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
			</section>

			<PageFooter />
		</div>
	);
}
