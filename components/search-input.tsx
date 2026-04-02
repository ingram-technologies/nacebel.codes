"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	placeholder: string;
	className?: string;
	autoFocus?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
	({ searchTerm, setSearchTerm, placeholder, className, autoFocus }, ref) => {
		return (
			<div className={cn("relative w-full", className)}>
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<Search className="h-5 w-5 text-muted-foreground/80" />
				</div>
				<Input
					ref={ref}
					type="search"
					placeholder={placeholder}
					autoFocus={autoFocus}
					className="h-14 rounded-2xl border-border/70 bg-white/90 pl-12 pr-4 text-base shadow-[0_24px_60px_-40px_rgba(15,23,42,0.65)] placeholder:text-muted-foreground/80 dark:bg-slate-950/60"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					aria-label={placeholder}
				/>
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";
