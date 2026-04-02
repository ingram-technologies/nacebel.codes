"use client";

import { Button } from "@/components/ui/button";
import type { Language, NacebelCode } from "@/types";
import { Check, Copy, ExternalLink } from "lucide-react";

const levelColorClasses: { [key: number]: string } = {
	2: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-300/20",
	3: "bg-amber-500/15 text-amber-700 ring-amber-600/20 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-300/20",
	4: "bg-sky-500/15 text-sky-700 ring-sky-600/20 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-300/20",
	5: "bg-rose-500/15 text-rose-700 ring-rose-600/20 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-300/20",
};
const defaultCodeColor = "bg-primary/10 text-primary ring-primary/20";

interface NacebelCodeItemProps {
	code: NacebelCode;
	language: Language;
	copiedCode: string | null;
	onCopy: (code: string, description: string) => void;
	getExternalLink: (code: string) => string;
}

export function NacebelCodeItem({
	code,
	language,
	copiedCode,
	onCopy,
	getExternalLink,
}: NacebelCodeItemProps) {
	return (
		<div
			key={code.code}
			className="group flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-white/75 p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_28px_60px_-35px_rgba(15,23,42,0.55)] dark:bg-white/5 sm:flex-row sm:items-center"
		>
			<div className="flex items-center gap-2">
				<span
					className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${levelColorClasses[code.level] || defaultCodeColor}`}
				>
					{code.code}
				</span>
				<span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
					Level {code.level}
				</span>
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-base font-medium text-foreground sm:text-[1.02rem]">
					{code.titles[language]}
				</p>
			</div>
			<div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onCopy(code.code, code.titles[language])}
					className="h-10 w-10 rounded-full p-0"
					aria-label="Copy to clipboard"
				>
					{copiedCode === code.code ? (
						<Check className="h-4 w-4 text-emerald-500" />
					) : (
						<Copy className="h-4 w-4 text-muted-foreground" />
					)}
				</Button>
				<Button
					variant="outline"
					size="sm"
					asChild
					className="h-10 w-10 rounded-full p-0"
					aria-label="Open external link"
				>
					<a
						href={getExternalLink(code.code)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
					</a>
				</Button>
			</div>
		</div>
	);
}
