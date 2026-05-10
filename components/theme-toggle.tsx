"use client";

import { Button } from "@/components/ui/button";
import type { Translation } from "@/lib/translations";
import type { Theme } from "@/types";
import { Monitor, Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	translations: Translation;
}

const THEME_LABEL_KEY = {
	light: "themeLight",
	dark: "themeDark",
	system: "themeSystem",
} as const satisfies Record<Theme, keyof Translation>;

const THEME_ICON = {
	light: Sun,
	dark: Moon,
	system: Monitor,
} as const;

export function ThemeToggle({ theme, setTheme, translations }: ThemeToggleProps) {
	return (
		<div className="flex items-center space-x-1 rounded-full border border-border/70 bg-background/80 p-1 shadow-sm backdrop-blur-sm">
			{(["light", "dark", "system"] as const).map((mode) => {
				const Icon = THEME_ICON[mode];
				const label = translations[THEME_LABEL_KEY[mode]];
				return (
					<Button
						key={mode}
						variant="ghost"
						size="icon"
						onClick={() => setTheme(mode)}
						className={`h-9 w-9 rounded-full p-2 ${
							theme === mode
								? "bg-primary text-primary-foreground shadow-[0_14px_30px_-22px_hsl(var(--primary))]"
								: "text-muted-foreground hover:bg-accent/80 hover:text-foreground"
						}`}
						aria-label={`Set theme to ${label}`}
					>
						<Icon className="h-4 w-4" />
					</Button>
				);
			})}
		</div>
	);
}
