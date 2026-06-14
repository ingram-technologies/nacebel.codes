"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/locale-context";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { siteScope } from "@/lib/i18n/scopes/site";
import { slugify } from "@/lib/slug";
import type { NacebelCode } from "@/types";
import { Download } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NacebelCodeList } from "./nacebel-code-list";
import { PageFooter } from "./page-footer";
import { PaginationControls } from "./pagination-controls";
import { SearchInput } from "./search-input";
import { SiteHeader } from "./site-header";

const ITEMS_PER_PAGE = 100;
const COPY_FEEDBACK_MS = 2000;
const URL_SYNC_DEBOUNCE_MS = 250;
const EXAMPLE_SEARCHES = ["software", "62.01", "consulting"];
const CODE_LIKE_RE = /^[\d.\s]+$/;
const PUNCTUATION_RE = /[^\p{L}\p{N}\s]/gu;

function normalizePunctuation(text: string): string {
	return text.replace(PUNCTUATION_RE, " ").toLowerCase();
}

function normalizeCodeSearch(text: string): string {
	return text.replace(/[\s.]+/g, "").toLowerCase();
}

function isCodeLikeSearch(searchTerm: string): boolean {
	return searchTerm.length > 0 && CODE_LIKE_RE.test(searchTerm);
}

function getSearchTokens(searchTerm: string): string[][] {
	return normalizePunctuation(searchTerm)
		.split(/\s+/)
		.filter(Boolean)
		.map((token) => {
			const variants = new Set<string>([token]);
			if (token.endsWith("ing") && token.length > 5) {
				variants.add(token.slice(0, -3));
			}
			if (token.endsWith("ies") && token.length > 4) {
				variants.add(`${token.slice(0, -3)}y`);
			}
			if (token.endsWith("s") && token.length > 4) {
				variants.add(token.slice(0, -1));
			}
			return Array.from(variants);
		});
}

function getSearchableText(code: NacebelCode): string {
	return normalizePunctuation(
		[
			code.code,
			...Object.values(code.titles),
			...Object.values(code.description),
		].join(" "),
	);
}

function getCodeSearchRank(code: NacebelCode, searchTerm: string): number {
	const codeValue = code.code.toLowerCase();
	const normalizedCodeValue = normalizeCodeSearch(code.code);
	const normalizedSearch = normalizeCodeSearch(searchTerm);

	if (codeValue === searchTerm || normalizedCodeValue === normalizedSearch) {
		return 0;
	}
	if (
		codeValue.startsWith(searchTerm) ||
		normalizedCodeValue.startsWith(normalizedSearch)
	) {
		return 1;
	}
	if (
		codeValue.includes(searchTerm) ||
		normalizedCodeValue.includes(normalizedSearch)
	) {
		return 2;
	}
	return 3;
}

function filterCodes(codes: NacebelCode[], searchTerm: string): NacebelCode[] {
	const trimmed = searchTerm.trim();
	if (trimmed.length === 0) return codes;

	if (isCodeLikeSearch(trimmed)) {
		const lowered = trimmed.toLowerCase();
		const normalizedQuery = normalizeCodeSearch(trimmed);
		return codes
			.filter((code) => {
				const normalizedCodeValue = normalizeCodeSearch(code.code);
				return (
					code.code.toLowerCase().startsWith(lowered) ||
					normalizedCodeValue.startsWith(normalizedQuery)
				);
			})
			.sort((a, b) => {
				const rankDiff =
					getCodeSearchRank(a, lowered) - getCodeSearchRank(b, lowered);
				if (rankDiff !== 0) return rankDiff;
				return a.code.length - b.code.length || a.code.localeCompare(b.code);
			});
	}

	const tokens = getSearchTokens(trimmed);
	return codes.filter((code) => {
		const text = getSearchableText(code);
		return tokens.every((tokenGroup) =>
			tokenGroup.some((token) => text.includes(token)),
		);
	});
}

interface NacebelSearchClientProps {
	initialCodes: NacebelCode[];
}

export default function NacebelSearchClient({
	initialCodes,
}: NacebelSearchClientProps) {
	const locale = useLocale();
	const t = useT(siteScope);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") ?? "");
	const [copiedCode, setCopiedCode] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const isFirstUrlSync = useRef(true);

	useEffect(() => {
		if (isFirstUrlSync.current) {
			isFirstUrlSync.current = false;
			return;
		}
		const handle = setTimeout(() => {
			const trimmed = searchTerm.trim();
			const url = trimmed
				? `${pathname}?q=${encodeURIComponent(trimmed)}`
				: pathname;
			router.replace(url, { scroll: false });
		}, URL_SYNC_DEBOUNCE_MS);
		return () => clearTimeout(handle);
	}, [searchTerm, router, pathname]);

	const filteredCodes = useMemo(
		() => filterCodes(initialCodes, searchTerm),
		[initialCodes, searchTerm],
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			const isTextInput =
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target?.isContentEditable === true;
			const isSlashShortcut =
				event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
			const isCommandShortcut =
				(event.metaKey || event.ctrlKey) &&
				event.key.toLowerCase() === "k" &&
				!event.altKey;

			if (!isSlashShortcut && !isCommandShortcut) return;
			if (
				isTextInput &&
				target !== searchInputRef.current &&
				!isCommandShortcut
			) {
				return;
			}

			event.preventDefault();
			searchInputRef.current?.focus();
			searchInputRef.current?.select();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const totalPages = Math.ceil(filteredCodes.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedCodes = useMemo(
		() => filteredCodes.slice(startIndex, endIndex),
		[filteredCodes, startIndex, endIndex],
	);

	const flashCopied = useCallback(
		(code: string) => {
			setCopiedCode(code);
			toast(t("Copied to clipboard"), {
				duration: COPY_FEEDBACK_MS,
			});
			setTimeout(() => setCopiedCode(null), COPY_FEEDBACK_MS);
		},
		[t],
	);

	const copyCodeOnly = useCallback(
		(code: string) => {
			navigator.clipboard.writeText(code).then(() => flashCopied(code));
		},
		[flashCopied],
	);

	const copyToClipboard = useCallback(
		(code: string, description: string) => {
			navigator.clipboard
				.writeText(`${code} - ${description}`)
				.then(() => flashCopied(code));
		},
		[flashCopied],
	);

	const getExternalLink = useCallback(
		(code: string) =>
			`https://kbopub.economie.fgov.be/kbopub/naceToelichting.html?lang=${locale}&nace.code=${code.replace(/\./g, "")}&nace.version=2025`,
		[locale],
	);

	const getDetailLink = useCallback(
		(code: NacebelCode) => {
			const title = code.titles[locale] || code.titles.en || code.code;
			const slug = slugify(title) || "code";
			return `/${locale}/${code.code}/${slug}`;
		},
		[locale],
	);

	const exportToCSV = () => {
		const headers = ["Level", "Code", `Description (${locale.toUpperCase()})`];
		const csvContent = [
			headers.join(","),
			...filteredCodes.map((code) =>
				[
					code.level,
					code.code,
					`"${(code.titles[locale] || "").replace(/"/g, '""')}"`,
				].join(","),
			),
		].join("\n");

		const blob = new Blob([`﻿${csvContent}`], {
			type: "text/csv;charset=utf-8;",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `nacebel_codes_${locale}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast(
			t("Exported {count} codes to CSV", {
				count: filteredCodes.length,
			}),
			{ duration: 3000 },
		);
	};

	if (initialCodes.length === 0) {
		return (
			<div className="text-center text-red-500 dark:text-red-400">
				Could not load NACEBEL codes.
			</div>
		);
	}

	const resultsHeading = searchTerm
		? t('Results for "{query}"', { query: searchTerm })
		: t("All codes");

	return (
		<div className="space-y-5 sm:space-y-6">
			<SiteHeader
				title={t("NACE-BEL 2025 Codes")}
				subtitle={t(
					"Search the official directory and export the current results.",
				)}
			/>

			<section className="sticky top-3 z-20 space-y-3 rounded-[1.25rem] border border-white/60 bg-white/88 p-3 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.6)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/88 sm:p-4">
				<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
					<span className="font-medium">{t("Try:")}</span>
					{EXAMPLE_SEARCHES.map((example) => (
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
				<SearchInput
					ref={searchInputRef}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					placeholder={t("Search by code number or description...")}
					className="max-w-none"
					autoFocus
				/>
			</section>

			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				setCurrentPage={setCurrentPage}
				className="justify-center"
			/>

			<section className="rounded-[1.75rem] border border-white/60 bg-white/78 p-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-4">
				<div className="border-b border-border/60 pb-4">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
								{resultsHeading}
							</h2>
							<p className="text-sm text-muted-foreground">
								{t("Showing {from}-{to} of {total, number} codes", {
									from: filteredCodes.length > 0 ? startIndex + 1 : 0,
									to: Math.min(endIndex, filteredCodes.length),
									total: filteredCodes.length,
								})}
								{totalPages > 1 &&
									` (${t("Page {page} of {pages}", {
										page: currentPage,
										pages: totalPages,
									})})`}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={exportToCSV}
							className="flex items-center gap-2 self-start lg:self-auto"
						>
							<Download className="h-4 w-4" />
							<span>{t("Export CSV")}</span>
						</Button>
					</div>
				</div>

				<div className="mt-4">
					{paginatedCodes.length > 0 ? (
						<NacebelCodeList
							codes={paginatedCodes}
							language={locale}
							searchTerm={searchTerm}
							copiedCode={copiedCode}
							onCopyCode={copyCodeOnly}
							onCopy={copyToClipboard}
							getExternalLink={getExternalLink}
							getDetailLink={getDetailLink}
						/>
					) : (
						<div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/60 py-14 text-center text-muted-foreground">
							{t("No NACEBEL codes found matching your search criteria")}
						</div>
					)}
				</div>
			</section>

			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				setCurrentPage={setCurrentPage}
				className="justify-center"
			/>

			<PageFooter />
		</div>
	);
}
