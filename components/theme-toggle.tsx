"use client";

import { Button } from "@/components/ui/button";
import type { Theme } from "@/types";
import { Monitor, Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	translations: any;
}

export function ThemeToggle({ theme, setTheme, translations }: ThemeToggleProps) {
	const t = translations;
	return (
		<div className="flex items-center space-x-1 rounded-full border border-border/70 bg-background/80 p-1 shadow-sm backdrop-blur-sm">
			{(["light", "dark", "system"] as const).map((mode) => (
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
					aria-label={`Set theme to ${mode === "light" ? t.themeLight : mode === "dark" ? t.themeDark : t.themeSystem}`}
				>
					{mode === "light" && <Sun className="h-4 w-4" />}
					{mode === "dark" && <Moon className="h-4 w-4" />}
					{mode === "system" && <Monitor className="h-4 w-4" />}
				</Button>
			))}
		</div>
	);
}
