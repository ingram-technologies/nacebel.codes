import NacebelSearchClient from "@/components/nacebel-search";
import { getPaginatedNacebelCodes } from "@/lib/nacebelData";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "NACE-BEL 2025 Codes",
	description:
		"Search through the complete NACEBEL classification system. Find economic activity codes quickly and efficiently.",
	openGraph: {
		title: "NACE-BEL 2025 Codes",
		description:
			"Search through the complete NACEBEL classification system. Find economic activity codes quickly and efficiently.",
		type: "website",
	},
};

export default async function Home() {
	// Fetch initial codes on the server
	// We'll fetch all codes here, as the client component handles its own filtering/pagination
	// based on the full dataset. The API endpoints handle their own pagination/filtering.
	const { data: initialCodes } = await getPaginatedNacebelCodes(1, 100000); // Fetch a large enough set to cover all codes for client-side use

	return (
		<div className="min-h-screen bg-background">
			<main className="max-w-4xl mx-auto py-12 px-4">
				<NacebelSearchClient initialCodes={initialCodes} />
			</main>
		</div>
	);
}
