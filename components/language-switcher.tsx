"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/contexts/locale-context";
import { LOCALE_NAMES, type Locale, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const path = pathname === "/" ? "" : pathname;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						className="flex items-center gap-2 rounded-full bg-card px-4"
					/>
				}
			>
				<span>{LOCALE_NAMES[locale]}</span>
				<ChevronDown className="h-4 w-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="rounded-2xl border-border bg-popover p-1"
			>
				{SUPPORTED_LOCALES.map((loc: Locale) => (
					<DropdownMenuItem
						key={loc}
						className="rounded-xl"
						render={<a href={`/${loc}${path}`}>{LOCALE_NAMES[loc]}</a>}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
