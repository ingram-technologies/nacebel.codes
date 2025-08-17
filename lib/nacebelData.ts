// lib/nacebelData.ts
import { NACEBEL, type NACEBELCode } from "nace-codes";

// Initialize NACEBEL instance
let nacebelInstance: NACEBEL | null = null;

// Helper function to get NACEBEL instance
function getNacebelInstance(): NACEBEL {
	if (!nacebelInstance) {
		nacebelInstance = new NACEBEL({ preload: true });
	}
	return nacebelInstance;
}

// Interface for the public API output (keeping backward compatibility)
interface PublicNacebelCode {
	level: number;
	code: string;
	titles: {
		en: string;
		de: string;
		fr: string;
		nl: string;
	};
	description: {
		en: string;
		de: string;
		fr: string;
		nl: string;
	};
	childrenCodes?: string[];
}

// Helper to format code for display (add dots)
function formatCodeForDisplay(code: string): string {
	const level =
		code.length === 1
			? 1
			: code.length === 2
				? 2
				: code.length === 3
					? 3
					: code.length === 4
						? 4
						: code.length === 5
							? 5
							: code.length === 7
								? 7
								: 0;

	if (level <= 2) {
		return code;
	}

	// Add dots for levels 3 and above
	if (level === 3) {
		return `${code.substring(0, 2)}.${code.substring(2)}`;
	}
	if (level === 4) {
		return `${code.substring(0, 2)}.${code.substring(2)}`;
	}
	if (level === 5) {
		return `${code.substring(0, 2)}.${code.substring(2)}`;
	}
	if (level === 7) {
		return `${code.substring(0, 2)}.${code.substring(2)}`;
	}
	return code;
}

// Map NACEBELCode to PublicNacebelCode for backward compatibility
function mapToPublicNacebelCode(
	code: NACEBELCode,
	includeChildren = false,
): PublicNacebelCode | null {
	// Skip level 1 codes as per original behavior
	if (code.level === 1) {
		return null;
	}

	const formattedCode = formatCodeForDisplay(code.code);

	const publicCode: PublicNacebelCode = {
		level: code.level,
		code: formattedCode,
		titles: {
			en: code.nationalTitles?.en || code.description.en || "",
			de: code.nationalTitles?.de || code.description.de || "",
			fr: code.nationalTitles?.fr || code.description.fr || "",
			nl: code.nationalTitles?.nl || code.description.nl || "",
		},
		description: {
			en: code.description.en || "",
			de: code.description.de || "",
			fr: code.description.fr || "",
			nl: code.description.nl || "",
		},
	};

	if (includeChildren) {
		const nacebel = getNacebelInstance();
		const children = nacebel.getChildren(code.code);
		publicCode.childrenCodes = children.map((c) => formatCodeForDisplay(c.code));
	}

	return publicCode;
}

// API functions
export async function getPaginatedNacebelCodes(
	page: number,
	limit: number,
	minLevel?: number,
): Promise<{ data: PublicNacebelCode[]; totalPages: number; totalItems: number }> {
	const nacebel = getNacebelInstance();

	// Get all codes excluding level 1
	let allCodes = nacebel.getAllCodes().filter((code) => code.level > 1);

	if (minLevel !== undefined && minLevel > 1) {
		allCodes = allCodes.filter((code) => code.level >= minLevel);
	}

	// Sort codes by their code string
	allCodes.sort((a, b) => a.code.localeCompare(b.code));

	const totalItems = allCodes.length;
	const totalPages = Math.ceil(totalItems / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;

	const data = allCodes
		.slice(startIndex, endIndex)
		.map((code) => mapToPublicNacebelCode(code, false))
		.filter((code): code is PublicNacebelCode => code !== null);

	return { data, totalPages, totalItems };
}

export async function searchNacebelCodes(
	query: string,
	page: number,
	limit: number,
	minLevel?: number,
): Promise<{ data: PublicNacebelCode[]; totalPages: number; totalItems: number }> {
	const nacebel = getNacebelInstance();

	// Clean query
	const cleanQuery = query.trim().toLowerCase();

	// Try different search strategies
	let results: NACEBELCode[] = [];

	// First try exact code match (with or without dots)
	const normalizedQuery = query.replace(/\./g, "");
	const exactCode = nacebel.getCode(normalizedQuery);
	if (exactCode && exactCode.level > 1) {
		results = [exactCode];
	}

	// If no exact match, search in all languages
	if (results.length === 0) {
		// Search in Dutch (primary language for NACEBEL)
		const nlResults = nacebel.search(cleanQuery, {
			language: "nl",
			limit: 100,
			fuzzy: true,
		});
		// Search in French
		const frResults = nacebel.search(cleanQuery, {
			language: "fr",
			limit: 100,
			fuzzy: true,
		});
		// Search in English
		const enResults = nacebel.search(cleanQuery, {
			language: "en",
			limit: 100,
			fuzzy: true,
		});
		// Search in German
		const deResults = nacebel.search(cleanQuery, {
			language: "de",
			limit: 100,
			fuzzy: true,
		});

		// Combine and deduplicate results
		const allResults = [...nlResults, ...frResults, ...enResults, ...deResults];
		const uniqueResults = new Map<string, NACEBELCode>();

		for (const result of allResults) {
			if (result.level > 1 && !uniqueResults.has(result.code)) {
				uniqueResults.set(result.code, result);
			}
		}

		results = Array.from(uniqueResults.values());
	}

	// Apply level filter
	if (minLevel !== undefined && minLevel > 1) {
		results = results.filter((code) => code.level >= minLevel);
	}

	// Sort by relevance (code length, then alphabetically)
	results.sort((a, b) => {
		// Exact code matches first
		const aCodeMatch = a.code.toLowerCase() === normalizedQuery;
		const bCodeMatch = b.code.toLowerCase() === normalizedQuery;
		if (aCodeMatch && !bCodeMatch) return -1;
		if (!aCodeMatch && bCodeMatch) return 1;

		// Then by level (higher level = more specific)
		if (a.level !== b.level) {
			return a.level - b.level;
		}

		// Then alphabetically
		return a.code.localeCompare(b.code);
	});

	const totalItems = results.length;
	const totalPages = Math.ceil(totalItems / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;

	const data = results
		.slice(startIndex, endIndex)
		.map((code) => mapToPublicNacebelCode(code, false))
		.filter((code): code is PublicNacebelCode => code !== null);

	return { data, totalPages, totalItems };
}

export async function getNacebelCodeDetails(
	idWithoutDots: string,
): Promise<PublicNacebelCode | null> {
	const nacebel = getNacebelInstance();

	// The ID comes without dots, so use it directly
	const code = nacebel.getCode(idWithoutDots);

	if (!code || code.level === 1) {
		return null;
	}

	return mapToPublicNacebelCode(code, true);
}
