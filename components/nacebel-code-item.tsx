"use client";

import { Button } from "@/components/ui/button";
import type { Language, NacebelCode } from "@/types";
import { Check, Copy, ExternalLink } from "lucide-react";
import { memo, type ReactNode } from "react";

const LEVEL_COLOR_CLASSES: Record<number, string> = {
	2: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-300/20",
	3: "bg-amber-500/15 text-amber-700 ring-amber-600/20 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-300/20",
	4: "bg-sky-500/15 text-sky-700 ring-sky-600/20 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-300/20",
	5: "bg-rose-500/15 text-rose-700 ring-rose-600/20 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-300/20",
};
const DEFAULT_CODE_COLOR = "bg-primary/10 text-primary ring-primary/20";

const REGEX_ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;
const PUNCTUATION_RE = /[^\p{L}\p{N}\s]/gu;
const CODE_LIKE_RE = /^[\d.\s]+$/;

function escapeRegExp(value: string): string {
	return value.replace(REGEX_ESCAPE_RE, "\\$&");
}

function buildSearchPatterns(searchTerm: string): string[] {
	const trimmed = searchTerm.trim();
	if (trimmed.length === 0) return [];
	const patterns = new Set<string>();

	if (CODE_LIKE_RE.test(trimmed)) {
		if (trimmed.length >= 2) patterns.add(trimmed);
		return Array.from(patterns);
	}

	for (const token of trimmed.split(/\s+/)) {
		if (token.length >= 2) patterns.add(token);
	}
	for (const token of trimmed
		.replace(PUNCTUATION_RE, " ")
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)) {
		if (token.length >= 2) patterns.add(token);
		if (token.endsWith("ing") && token.length > 5) {
			patterns.add(token.slice(0, -3));
		}
		if (token.endsWith("ies") && token.length > 4) {
			patterns.add(`${token.slice(0, -3)}y`);
		}
		if (token.endsWith("s") && token.length > 4) {
			patterns.add(token.slice(0, -1));
		}
	}

	return Array.from(patterns).sort((a, b) => b.length - a.length);
}

function renderHighlightedText(text: string, searchTerm: string): ReactNode {
	const patterns = buildSearchPatterns(searchTerm);
	if (patterns.length === 0) return text;

	const ranges: Array<{ start: number; end: number }> = [];
	for (const pattern of patterns) {
		const regex = new RegExp(escapeRegExp(pattern), "gi");
		for (const match of text.matchAll(regex)) {
			if (match.index !== undefined) {
				ranges.push({ start: match.index, end: match.index + match[0].length });
			}
		}
	}
	if (ranges.length === 0) return text;

	ranges.sort((a, b) => a.start - b.start || b.end - a.end);

	const merged: Array<{ start: number; end: number }> = [];
	for (const range of ranges) {
		const previous = merged[merged.length - 1];
		if (!previous || range.start > previous.end) {
			merged.push({ ...range });
		} else if (range.end > previous.end) {
			previous.end = range.end;
		}
	}

	const out: ReactNode[] = [];
	let cursor = 0;
	for (const range of merged) {
		if (range.start > cursor) out.push(text.slice(cursor, range.start));
		out.push(
			<strong key={`${range.start}-${range.end}`} className="font-semibold">
				{text.slice(range.start, range.end)}
			</strong>,
		);
		cursor = range.end;
	}
	if (cursor < text.length) out.push(text.slice(cursor));
	return out;
}

interface NacebelCodeItemProps {
	code: NacebelCode;
	language: Language;
	searchTerm: string;
	copiedCode: string | null;
	onCopyCode: (code: string) => void;
	onCopy: (code: string, description: string) => void;
	getExternalLink: (code: string) => string;
	getDetailLink: (code: NacebelCode) => string;
}

function NacebelCodeItemImpl({
	code,
	language,
	searchTerm,
	copiedCode,
	onCopyCode,
	onCopy,
	getExternalLink,
	getDetailLink,
}: NacebelCodeItemProps) {
	const isCopied = copiedCode === code.code;
	const colorClass = LEVEL_COLOR_CLASSES[code.level] || DEFAULT_CODE_COLOR;

	return (
		<div className="group flex flex-col gap-3 rounded-[1.25rem] border border-border/70 bg-white/75 p-3 shadow-[0_16px_36px_-34px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-colors duration-200 hover:border-primary/20 dark:bg-white/5 sm:flex-row sm:items-center">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => onCopyCode(code.code)}
					aria-label={`Copy code ${code.code}`}
					className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${colorClass}`}
				>
					{renderHighlightedText(code.code, searchTerm)}
				</button>
			</div>
			<div className="min-w-0 flex-1">
				<a
					href={getDetailLink(code)}
					className="text-base font-medium leading-7 text-foreground transition-colors hover:text-primary"
				>
					{renderHighlightedText(code.titles[language], searchTerm)}
				</a>
			</div>
			<div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onCopy(code.code, code.titles[language])}
					className="h-9 w-9 rounded-full p-0"
					aria-label="Copy to clipboard"
				>
					{isCopied ? (
						<Check className="h-3.5 w-3.5 text-emerald-500" />
					) : (
						<Copy className="h-3.5 w-3.5 text-muted-foreground" />
					)}
				</Button>
				<Button
					variant="outline"
					size="sm"
					asChild
					className="h-9 w-9 rounded-full p-0"
					aria-label="Open external link"
				>
					<a
						href={getExternalLink(code.code)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
					</a>
				</Button>
				<span className="inline-flex min-w-6 items-center justify-center text-xs font-semibold text-muted-foreground">
					{code.level}
				</span>
			</div>
		</div>
	);
}

export const NacebelCodeItem = memo(NacebelCodeItemImpl);
