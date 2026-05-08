"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n/locales";

export type { Locale };

const LocaleContext = createContext<Locale>("en");

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider: React.FC<{
	value: Locale;
	children: React.ReactNode;
}> = ({ value, children }) => (
	<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
);
