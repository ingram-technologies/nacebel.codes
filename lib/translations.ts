import type { Language } from "@/types";

export interface Translation {
	title: string;
	subtitle: string;
	metaTitle: string;
	metaDescription: string;
	searchPlaceholder: string;
	tryLabel: string;
	allCodes: string;
	resultsFor: (query: string) => string;
	showing: string;
	of: string;
	codes: string;
	noCodes: string;
	copied: string;
	loading: string;
	error: string;
	exportCsv: string;
	previous: string;
	next: string;
	page: string;
	exportedCsv: (count: number) => string;
	recommendationLabel: string;
	recommendationText: string;
	recommendationCta: string;
	themeLight: string;
	themeDark: string;
	themeSystem: string;
	backToDirectory: string;
	parentCode: string;
	childCodes: string;
	level: string;
	viewOnKbo: string;
	codeMetaDescription: (code: string, title: string) => string;
}

export const translations: Record<Language, Translation> = {
	en: {
		title: "NACE-BEL 2025 Codes",
		subtitle: "Search the official directory and export the current results.",
		metaTitle: "NACE-BEL 2025 Codes — Search the Belgian classification",
		metaDescription:
			"Search the full NACE-BEL 2025 classification of Belgian economic activity codes in Dutch, French, English, and German. Browse the directory, copy codes, or use the free public API.",
		searchPlaceholder: "Search by code number or description...",
		tryLabel: "Try:",
		allCodes: "All codes",
		resultsFor: (query: string) => `Results for "${query}"`,
		showing: "Showing",
		of: "of",
		codes: "codes",
		noCodes: "No NACEBEL codes found matching your search criteria",
		copied: "Copied to clipboard",
		loading: "Loading NACEBEL codes...",
		error: "Error processing NACEBEL codes",
		exportCsv: "Export CSV",
		previous: "Previous",
		next: "Next",
		page: "Page",
		exportedCsv: (count: number) => `Exported ${count} codes to CSV`,
		recommendationLabel: "Recommendation from the team",
		recommendationText:
			"Need to incorporate a Belgian company? Beldoc handles it online with a cleaner, lower-friction flow.",
		recommendationCta: "Visit beldoc.be",
		themeLight: "Light",
		themeDark: "Dark",
		themeSystem: "System",
		backToDirectory: "Back to directory",
		parentCode: "Parent code",
		childCodes: "Child codes",
		level: "Level",
		viewOnKbo: "View on KBO (Crossroads Bank for Enterprises)",
		codeMetaDescription: (code: string, title: string) =>
			`NACE-BEL 2025 code ${code} — ${title}. Activity classification used by Belgian businesses for registration, tax, and statistics.`,
	},
	de: {
		title: "NACE-BEL 2025 Codes",
		subtitle:
			"Durchsuchen Sie das offizielle Verzeichnis und exportieren Sie die aktuellen Ergebnisse.",
		metaTitle: "NACE-BEL 2025 Codes — Durchsuchen Sie die belgische Klassifikation",
		metaDescription:
			"Durchsuchen Sie die vollständige NACE-BEL 2025 Klassifikation der belgischen Wirtschaftstätigkeiten in Niederländisch, Französisch, Englisch und Deutsch. Verzeichnis, Codes kopieren, oder kostenlose öffentliche API.",
		searchPlaceholder: "Nach Codenummer oder Beschreibung suchen...",
		tryLabel: "Versuchen Sie:",
		allCodes: "Alle Codes",
		resultsFor: (query: string) => `Ergebnisse fur "${query}"`,
		showing: "Anzeigen",
		of: "von",
		codes: "Codes",
		noCodes: "Keine NACEBEL-Codes gefunden, die Ihren Suchkriterien entsprechen",
		copied: "In die Zwischenablage kopiert",
		loading: "NACEBEL-Codes werden geladen...",
		error: "Fehler bei der Verarbeitung der NACEBEL-Codes",
		exportCsv: "CSV exportieren",
		previous: "Zurück",
		next: "Weiter",
		page: "Seite",
		exportedCsv: (count: number) => `${count} Codes als CSV exportiert`,
		recommendationLabel: "Empfehlung des Teams",
		recommendationText:
			"Sie grunden ein belgisches Unternehmen? Beldoc begleitet den Prozess online mit einem deutlich einfacheren Ablauf.",
		recommendationCta: "beldoc.be besuchen",
		themeLight: "Hell",
		themeDark: "Dunkel",
		themeSystem: "System",
		backToDirectory: "Zurück zum Verzeichnis",
		parentCode: "Übergeordneter Code",
		childCodes: "Untercodes",
		level: "Ebene",
		viewOnKbo: "Auf der KBO (Zentrale Datenbank der Unternehmen) anzeigen",
		codeMetaDescription: (code: string, title: string) =>
			`NACE-BEL 2025 Code ${code} — ${title}. Tätigkeitsklassifikation, die belgische Unternehmen für Registrierung, Steuern und Statistik verwenden.`,
	},
	fr: {
		title: "NACE-BEL 2025 Codes",
		subtitle:
			"Recherchez dans le repertoire officiel et exportez les resultats actuels.",
		metaTitle: "Codes NACE-BEL 2025 — Recherche de la classification belge",
		metaDescription:
			"Recherchez la classification NACE-BEL 2025 complète des activités économiques belges en néerlandais, français, anglais et allemand. Parcourez le répertoire, copiez les codes ou utilisez l'API publique gratuite.",
		searchPlaceholder: "Rechercher par numéro de code ou description...",
		tryLabel: "Essayer :",
		allCodes: "Tous les codes",
		resultsFor: (query: string) => `Resultats pour "${query}"`,
		showing: "Affichage",
		of: "sur",
		codes: "codes",
		noCodes: "Aucun code NACEBEL correspondant à vos critères de recherche",
		copied: "Copié dans le presse-papiers",
		loading: "Chargement des codes NACEBEL...",
		error: "Erreur lors du traitement des codes NACEBEL",
		exportCsv: "Exporter CSV",
		previous: "Précédent",
		next: "Suivant",
		page: "Page",
		exportedCsv: (count: number) => `${count} codes exportes en CSV`,
		recommendationLabel: "Recommandation de l'equipe",
		recommendationText:
			"Besoin de constituer une societe belge ? Beldoc gere cela en ligne avec un parcours plus simple et plus fluide.",
		recommendationCta: "Visiter beldoc.be",
		themeLight: "Clair",
		themeDark: "Sombre",
		themeSystem: "Système",
		backToDirectory: "Retour au répertoire",
		parentCode: "Code parent",
		childCodes: "Codes enfants",
		level: "Niveau",
		viewOnKbo: "Voir sur la BCE (Banque-Carrefour des Entreprises)",
		codeMetaDescription: (code: string, title: string) =>
			`Code NACE-BEL 2025 ${code} — ${title}. Classification des activités utilisée par les entreprises belges pour l'enregistrement, la fiscalité et les statistiques.`,
	},
	nl: {
		title: "NACE-BEL 2025 Codes",
		subtitle: "Doorzoek de officiele directory en exporteer de huidige resultaten.",
		metaTitle: "NACE-BEL 2025 Codes — Doorzoek de Belgische classificatie",
		metaDescription:
			"Doorzoek de volledige NACE-BEL 2025 classificatie van Belgische economische activiteiten in het Nederlands, Frans, Engels en Duits. Blader door de directory, kopieer codes of gebruik de gratis publieke API.",
		searchPlaceholder: "Zoeken op codenummer of beschrijving...",
		tryLabel: "Probeer:",
		allCodes: "Alle codes",
		resultsFor: (query: string) => `Resultaten voor "${query}"`,
		showing: "Tonen",
		of: "van",
		codes: "codes",
		noCodes: "Geen NACEBEL-codes gevonden die overeenkomen met uw zoekcriteria",
		copied: "Gekopieerd naar klembord",
		loading: "NACEBEL-codes laden...",
		error: "Fout bij het verwerken van de NACEBEL-codes",
		exportCsv: "CSV exportieren",
		previous: "Vorige",
		next: "Volgende",
		page: "Pagina",
		exportedCsv: (count: number) => `${count} codes geexporteerd naar CSV`,
		recommendationLabel: "Aanrader van het team",
		recommendationText:
			"Een Belgisch bedrijf oprichten? Beldoc regelt dat online met een veel eenvoudigere flow.",
		recommendationCta: "Bezoek beldoc.be",
		themeLight: "Licht",
		themeDark: "Donker",
		themeSystem: "Systeem",
		backToDirectory: "Terug naar de directory",
		parentCode: "Bovenliggende code",
		childCodes: "Onderliggende codes",
		level: "Niveau",
		viewOnKbo: "Bekijk op KBO (Kruispuntbank van Ondernemingen)",
		codeMetaDescription: (code: string, title: string) =>
			`NACE-BEL 2025 code ${code} — ${title}. Activiteitenclassificatie die Belgische bedrijven gebruiken voor registratie, belastingen en statistieken.`,
	},
};
