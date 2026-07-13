import { Archivo, JetBrains_Mono } from "next/font/google";

// Shared across both root layouts (the static `[locale]` tree and the dynamic
// `(site)` tree), so the font instances are declared once.
export const archivo = Archivo({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-archivo",
});

export const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-jetbrains-mono",
});
