// lib/nacebelData.ts

interface NacebelCode {
	level: number;
	code: string; // e.g., "01.11"
	titles: {
		en: string;
		de: string;
		fr: string;
		nl: string;
	};
	searchableCode: string; // e.g., "0111"
	searchableTitles: {
		en: string;
		de: string;
		fr: string;
		nl: string;
	};
	idWithoutDots: string; // e.g., "0111"
	childrenCodes?: string[]; // e.g., ["01.111", "01.112"] for "01.11"
}

// Interface for the public API output
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
		// As requested, always include an empty description
		en: string;
		de: string;
		fr: string;
		nl: string;
	};
	childrenCodes?: string[]; // Only included for detail endpoint, but optional here
}

// Centralized data store (cached in memory)
let nacebelData: NacebelCode[] | null = null;
let nacebelCodeMap: Map<string, NacebelCode> | null = null; // Map code (with dots) to NacebelCode
let nacebelIdWithoutDotsMap: Map<string, NacebelCode> | null = null; // Map idWithoutDots to NacebelCode
let nacebelChildrenMap: Map<string, string[]> | null = null; // Map parentCode (with dots) to array of child codes (with dots)

// Helper function to remove punctuation for search optimization and ID generation
function cleanTextForSearch(text: string): string {
	if (!text) return "";
	// Remove non-alphanumeric characters (except spaces), convert to lowercase
	return text.replace(/[^\p{L}\p{N}\s]/gu, "").toLowerCase();
}

function cleanCodeForId(code: string): string {
	if (!code) return "";
	return code.replace(/\./g, ""); // Removes only dots
}

// Helper function to parse CSV line with potential quoted fields containing commas
function parseCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === "," && !inQuotes) {
			result.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}
	result.push(current.trim());
	return result;
}

// Parse CSV data
function parseCSV(csvText: string): NacebelCode[] {
	const lines = csvText.split("\n");
	if (lines.length === 0) return [];
	const headers = lines[0].split(",");

	const levelIndex = headers.findIndex((h) => h.trim() === "LEVEL");
	const codeIndex = headers.findIndex((h) => h.trim() === "CODE");
	const nlIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_NL");
	const frIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_FR");
	const deIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_DE");
	const enIndex = headers.findIndex((h) => h.trim() === "NATIONAL_TITLE_BE_EN");

	const codes: NacebelCode[] = [];
	for (let i = 1; i < lines.length; i++) {
		if (!lines[i].trim()) continue;
		const values = parseCSVLine(lines[i]);
		if (
			values.length
			>= Math.max(levelIndex, codeIndex, nlIndex, frIndex, deIndex, enIndex) + 1
		) {
			const level = Number.parseInt(values[levelIndex], 10) || 0;
			if (level === 1) continue; // Skip Level 1 codes as per previous request

			const originalCode = values[codeIndex] || "";
			const titleNL = values[nlIndex] || "";
			const titleFR = values[frIndex] || "";
			const titleDE = values[deIndex] || "";
			const titleEN = values[enIndex] || "";

			codes.push({
				level,
				code: originalCode,
				titles: {
					nl: titleNL,
					fr: titleFR,
					de: titleDE,
					en: titleEN,
				},
				searchableCode: cleanTextForSearch(originalCode),
				searchableTitles: {
					nl: cleanTextForSearch(titleNL),
					fr: cleanTextForSearch(titleFR),
					de: cleanTextForSearch(titleDE),
					en: cleanTextForSearch(titleEN),
				},
				idWithoutDots: cleanCodeForId(originalCode),
			});
		}
	}
	return codes;
}

// Helper to map internal NacebelCode to public-facing PublicNacebelCode
function mapToPublicNacebelCode(
	code: NacebelCode,
	includeChildren = false,
): PublicNacebelCode {
	const publicCode: PublicNacebelCode = {
		level: code.level,
		code: code.code,
		titles: code.titles,
		description: { en: "", de: "", fr: "", nl: "" }, // Always empty as per request
	};
	if (includeChildren && code.childrenCodes) {
		publicCode.childrenCodes = code.childrenCodes;
	}
	return publicCode;
}

// Function to load and cache NACEBEL data
async function loadNacebelData(): Promise<void> {
	if (
		nacebelData
		&& nacebelCodeMap
		&& nacebelIdWithoutDotsMap
		&& nacebelChildrenMap
	) {
		return; // Data already loaded
	}

	try {
		const response = await fetch(
			"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NACEBEL_2025.xlsx%20-%20NACEBEL2025-Wz64kIuDaBa2WaeY8tPWRHpPyPHlTq.csv",
			{ next: { revalidate: 3600 } }, // Revalidate data every hour
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch NACEBEL codes: ${response.status}`);
		}

		const csvText = await response.text();
		const parsedCodes = parseCSV(csvText);

		const codeMap = new Map<string, NacebelCode>();
		const idWithoutDotsMap = new Map<string, NacebelCode>();
		const childrenMap = new Map<string, string[]>(); // Stores parentCode -> [childCode]

		// First pass: populate maps and add idWithoutDots
		parsedCodes.forEach((codeEntry) => {
			codeMap.set(codeEntry.code, codeEntry);
			idWithoutDotsMap.set(codeEntry.idWithoutDots, codeEntry);
		});

		// Second pass: build hierarchy
		parsedCodes.forEach((codeEntry) => {
			const currentCode = codeEntry.code;
			const currentLevel = codeEntry.level;

			let parentCode: string | undefined;
			if (currentLevel === 3) {
				// e.g., 01.1 -> parent 01
				parentCode = currentCode.substring(0, 2);
			} else if (currentLevel === 4) {
				// e.g., 01.11 -> parent 01.1
				parentCode = currentCode.substring(0, 5);
			} else if (currentLevel === 5) {
				// e.g., 01.111 -> parent 01.11
				parentCode = currentCode.substring(0, 8);
			}

			if (parentCode && codeMap.has(parentCode)) {
				if (!childrenMap.has(parentCode)) {
					childrenMap.set(parentCode, []);
				}
				childrenMap.get(parentCode)?.push(currentCode);
			}
		});

		nacebelData = parsedCodes;
		nacebelCodeMap = codeMap;
		nacebelIdWithoutDotsMap = idWithoutDotsMap;
		nacebelChildrenMap = childrenMap;
	} catch (err) {
		console.error("Error loading NACEBEL data:", err);
		nacebelData = []; // Ensure it's not null on error
		nacebelCodeMap = new Map();
		nacebelIdWithoutDotsMap = new Map();
		nacebelChildrenMap = new Map();
		throw err; // Re-throw to indicate failure
	}
}

// API functions
export async function getPaginatedNacebelCodes(
	page: number,
	limit: number,
	minLevel?: number,
): Promise<{ data: PublicNacebelCode[]; totalPages: number; totalItems: number }> {
	await loadNacebelData();
	let allCodes = nacebelData || [];

	if (minLevel !== undefined) {
		allCodes = allCodes.filter((code) => code.level >= minLevel);
	}

	const totalItems = allCodes.length;
	const totalPages = Math.ceil(totalItems / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const data = allCodes
		.slice(startIndex, endIndex)
		.map((code) => mapToPublicNacebelCode(code));
	return { data, totalPages, totalItems };
}

export async function searchNacebelCodes(
	query: string,
	page: number,
	limit: number,
	minLevel?: number,
): Promise<{ data: PublicNacebelCode[]; totalPages: number; totalItems: number }> {
	await loadNacebelData();
	let allCodes = nacebelData || [];

	if (minLevel !== undefined) {
		allCodes = allCodes.filter((code) => code.level >= minLevel);
	}

	const searchableQuery = cleanTextForSearch(query);
	const queryTokens = searchableQuery.split(/\s+/).filter(Boolean); // Split by spaces, remove empty tokens

	const results = allCodes.filter((codeEntry) => {
		// Check if all query tokens are present in code or any title
		return queryTokens.every(
			(token) =>
				codeEntry.searchableCode.includes(token)
				|| Object.values(codeEntry.searchableTitles).some((title) =>
					title.includes(token),
				),
		);
	});

	// Simple sorting heuristic for "best match"
	results.sort((a, b) => {
		const aCode = a.searchableCode;
		const bCode = b.searchableCode;
		const aTitles = Object.values(a.searchableTitles);
		const bTitles = Object.values(b.searchableTitles);

		// Prioritize exact code match
		if (aCode === searchableQuery && bCode !== searchableQuery) return -1;
		if (bCode === searchableQuery && aCode !== searchableQuery) return 1;

		// Prioritize code starts with query
		if (aCode.startsWith(searchableQuery) && !bCode.startsWith(searchableQuery))
			return -1;
		if (bCode.startsWith(searchableQuery) && !aCode.startsWith(searchableQuery))
			return 1;

		// Prioritize title starts with query (any language)
		if (
			aTitles.some((t) => t.startsWith(searchableQuery))
			&& !bTitles.some((t) => t.startsWith(searchableQuery))
		)
			return -1;
		if (
			bTitles.some((t) => t.startsWith(searchableQuery))
			&& !aTitles.some((t) => t.startsWith(searchableQuery))
		)
			return 1;

		// Prioritize code contains query
		if (aCode.includes(searchableQuery) && !bCode.includes(searchableQuery))
			return -1;
		if (bCode.includes(searchableQuery) && !aCode.includes(searchableQuery))
			return 1;

		// Prioritize title contains query (any language)
		if (
			aTitles.some((t) => t.includes(searchableQuery))
			&& !bTitles.some((t) => t.includes(searchableQuery))
		)
			return -1;
		if (
			bTitles.some((t) => t.includes(searchableQuery))
			&& !aTitles.some((t) => t.includes(searchableQuery))
		)
			return 1;

		return 0; // No strong preference
	});

	const totalItems = results.length;
	const totalPages = Math.ceil(totalItems / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const data = results
		.slice(startIndex, endIndex)
		.map((code) => mapToPublicNacebelCode(code));
	return { data, totalPages, totalItems };
}

export async function getNacebelCodeDetails(
	idWithoutDots: string,
): Promise<PublicNacebelCode | null> {
	await loadNacebelData();
	const code = nacebelIdWithoutDotsMap?.get(idWithoutDots);
	if (!code) {
		return null;
	}

	// Add children codes to the internal object before mapping to public
	const children = nacebelChildrenMap?.get(code.code) || [];
	const codeWithChildren: NacebelCode = { ...code, childrenCodes: children };

	return mapToPublicNacebelCode(codeWithChildren, true); // Include children in the public output
}
