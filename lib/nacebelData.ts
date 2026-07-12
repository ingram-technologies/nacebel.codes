import { NACEBEL, type NACEBELCode } from "nace-codes/nacebel";

let nacebelInstance: NACEBEL | null = null;

function getNacebelInstance(): NACEBEL {
	if (!nacebelInstance) {
		nacebelInstance = new NACEBEL({ preload: true });
	}
	return nacebelInstance;
}

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
	/**
	 * Full explanatory note (KBO "Explication" / "Toelichting"), as Markdown with
	 * `[[code]]` wikilinks. Present only for codes that have one.
	 */
	explanatoryNote?: {
		en: string;
		de: string;
		fr: string;
		nl: string;
	};
	childrenCodes?: string[];
}

function formatCodeForDisplay(code: string): string {
	if (code.length <= 2) return code;
	return `${code.slice(0, 2)}.${code.slice(2)}`;
}

function mapToPublicNacebelCode(
	code: NACEBELCode,
	includeChildren = false,
): PublicNacebelCode | null {
	if (code.level === 1) return null;

	const publicCode: PublicNacebelCode = {
		level: code.level,
		code: formatCodeForDisplay(code.code),
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
		explanatoryNote: code.explanatoryNote
			? {
					en: code.explanatoryNote.en || "",
					de: code.explanatoryNote.de || "",
					fr: code.explanatoryNote.fr || "",
					nl: code.explanatoryNote.nl || "",
				}
			: undefined,
	};

	if (includeChildren) {
		const children = getNacebelInstance().getChildren(code.code);
		publicCode.childrenCodes = children.map((c) => formatCodeForDisplay(c.code));
	}

	return publicCode;
}

export async function getPaginatedNacebelCodes(
	page: number,
	limit: number,
	minLevel?: number,
): Promise<{ data: PublicNacebelCode[]; totalPages: number; totalItems: number }> {
	const nacebel = getNacebelInstance();
	const effectiveMinLevel = minLevel && minLevel > 1 ? minLevel : 2;

	const allCodes = nacebel
		.getAllCodes()
		.filter((code) => code.level >= effectiveMinLevel)
		.sort((a, b) => a.code.localeCompare(b.code));

	const totalItems = allCodes.length;
	const totalPages = Math.ceil(totalItems / limit);
	const startIndex = (page - 1) * limit;

	const data = allCodes
		.slice(startIndex, startIndex + limit)
		.map((code) => mapToPublicNacebelCode(code, false))
		.filter((code): code is PublicNacebelCode => code !== null);

	return { data, totalPages, totalItems };
}

const SEARCH_LANGUAGES = ["nl", "fr", "en", "de"] as const;

export async function searchNacebelCodes(
	query: string,
	page: number,
	limit: number,
	minLevel?: number,
): Promise<{ data: PublicNacebelCode[]; totalPages: number; totalItems: number }> {
	const nacebel = getNacebelInstance();
	const cleanQuery = query.trim().toLowerCase();
	const normalizedQuery = query.replace(/\./g, "");

	let results: NACEBELCode[] = [];

	const exactCode = nacebel.getCode(normalizedQuery);
	if (exactCode && exactCode.level > 1) {
		results = [exactCode];
	} else {
		const seen = new Map<string, NACEBELCode>();
		for (const language of SEARCH_LANGUAGES) {
			const matches = nacebel.search(cleanQuery, {
				language,
				limit: 100,
				fuzzy: true,
			});
			for (const match of matches) {
				if (match.level > 1 && !seen.has(match.code)) {
					seen.set(match.code, match);
				}
			}
		}
		results = Array.from(seen.values());
	}

	if (minLevel !== undefined && minLevel > 1) {
		results = results.filter((code) => code.level >= minLevel);
	}

	results.sort((a, b) => {
		const aCodeMatch = a.code.toLowerCase() === normalizedQuery;
		const bCodeMatch = b.code.toLowerCase() === normalizedQuery;
		if (aCodeMatch !== bCodeMatch) return aCodeMatch ? -1 : 1;
		if (a.level !== b.level) return a.level - b.level;
		return a.code.localeCompare(b.code);
	});

	const totalItems = results.length;
	const totalPages = Math.ceil(totalItems / limit);
	const startIndex = (page - 1) * limit;

	const data = results
		.slice(startIndex, startIndex + limit)
		.map((code) => mapToPublicNacebelCode(code, false))
		.filter((code): code is PublicNacebelCode => code !== null);

	return { data, totalPages, totalItems };
}

export async function getNacebelCodeDetails(
	idWithoutDots: string,
): Promise<PublicNacebelCode | null> {
	const code = getNacebelInstance().getCode(idWithoutDots);
	if (!code || code.level === 1) return null;
	return mapToPublicNacebelCode(code, true);
}

export async function getNacebelAncestors(
	idWithoutDots: string,
): Promise<PublicNacebelCode[]> {
	const ancestors = getNacebelInstance().getAncestors(idWithoutDots);
	return ancestors
		.map((code) => mapToPublicNacebelCode(code, false))
		.filter((code): code is PublicNacebelCode => code !== null)
		.reverse();
}
