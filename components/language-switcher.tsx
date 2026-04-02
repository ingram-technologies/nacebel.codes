"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Language } from "@/types";
import { ChevronDown } from "lucide-react";

interface LanguageSwitcherProps {
	language: Language;
	changeLanguage: (lang: Language) => void;
}

const languages: Record<Language, { name: string }> = {
	en: { name: "English" },
	de: { name: "Deutsch" },
	fr: { name: "Français" },
	nl: { name: "Nederlands" },
};

export function LanguageSwitcher({ language, changeLanguage }: LanguageSwitcherProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center gap-2 rounded-full bg-background/80 px-4 backdrop-blur-sm"
				>
					<span>{languages[language].name}</span>
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="rounded-2xl border-border/70 bg-background/95 p-1 backdrop-blur-xl"
			>
				{Object.entries(languages).map(([code, lang]) => (
					<DropdownMenuItem
						key={code}
						onClick={() => changeLanguage(code as Language)}
						className="rounded-xl"
					>
						{lang.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
