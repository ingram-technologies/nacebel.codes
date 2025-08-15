import { PageFooter } from "@/components/page-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About NACE-BEL Codes - Statistical Classification System",
	description:
		"Learn about NACE and NACE-BEL codes, the European statistical classification system for economic activities. Understand the structure, versions, and applications of these standardized codes.",
	openGraph: {
		title: "About NACE-BEL Codes - Statistical Classification System",
		description:
			"Learn about NACE and NACE-BEL codes, the European statistical classification system for economic activities. Understand the structure, versions, and applications of these standardized codes.",
		type: "website",
	},
};

export default function AboutPage() {
	return (
		<div className="bg-background text-foreground">
			<div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
				<header className="text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">
						About NACE-BEL Codes
					</h1>
					<p className="text-lg text-muted-foreground">
						Understanding the European statistical classification system for
						economic activities
					</p>
				</header>

				<nav className="flex justify-center">
					<a
						href="/"
						className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
					>
						← Back to Search
					</a>
				</nav>

				<div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
					<section>
						<h2 className="text-2xl font-semibold border-b pb-2 mb-4">
							What is NACE?
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							NACE (Nomenclature statistique des activités économiques
							dans la Communauté européenne) is the European statistical
							classification of economic activities. It is the standard
							classification system used across the European Union for
							categorizing business activities and economic sectors.
						</p>
						<p className="text-muted-foreground leading-relaxed">
							NACE provides a framework for collecting and presenting
							statistical data related to economic activities in a
							comparable way across EU member states. It serves as the
							basis for economic statistics, business registers, and
							various administrative purposes.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold border-b pb-2 mb-4">
							What is NACE-BEL?
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							NACE-BEL is the Belgian national version of the NACE
							classification system. While it follows the European NACE
							structure, it includes additional subdivisions and
							specifications that are relevant to the Belgian economy and
							administrative requirements.
						</p>
						<p className="text-muted-foreground leading-relaxed">
							NACE-BEL codes are used by Belgian businesses for official
							registrations, tax purposes, statistical reporting, and
							various administrative procedures. Every business registered
							in Belgium must declare their primary and secondary economic
							activities using NACE-BEL codes.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold border-b pb-2 mb-4">
							Code Structure
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							NACE-BEL codes follow a hierarchical structure with multiple
							levels of detail:
						</p>
						<div className="bg-muted/50 rounded-lg p-6 space-y-4">
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
										Level 2
									</span>
									<span className="font-mono text-sm">01</span>
									<span className="text-sm text-muted-foreground">
										Section (broadest category)
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
										Level 3
									</span>
									<span className="font-mono text-sm">01.1</span>
									<span className="text-sm text-muted-foreground">
										Division
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
										Level 4
									</span>
									<span className="font-mono text-sm">01.11</span>
									<span className="text-sm text-muted-foreground">
										Group
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
										Level 5
									</span>
									<span className="font-mono text-sm">01.111</span>
									<span className="text-sm text-muted-foreground">
										Class (most specific)
									</span>
								</div>
							</div>
						</div>
						<p className="text-muted-foreground leading-relaxed">
							Each level provides increasingly specific categorization,
							allowing businesses and statisticians to classify economic
							activities at the appropriate level of detail for their
							needs.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold border-b pb-2 mb-4">
							NACE-BEL Versions
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							NACE-BEL has been updated several times to reflect changes
							in the economy and to maintain alignment with European
							standards:
						</p>
						<div className="space-y-4">
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg">NACE-BEL 2003</h3>
								<p className="text-muted-foreground">
									Based on NACE Rev. 1.1, this version was used in the
									early 2000s and reflected the economic structure of
									that period.
								</p>
							</div>
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg">NACE-BEL 2008</h3>
								<p className="text-muted-foreground">
									Based on NACE Rev. 2, this version introduced
									significant changes to better reflect the modern
									economy, including new sectors related to
									information technology and services.
								</p>
							</div>
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg">NACE-BEL 2025</h3>
								<p className="text-muted-foreground">
									The current version, which includes updates to
									reflect recent economic developments and maintains
									compatibility with the latest European NACE
									standards.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold border-b pb-2 mb-4">
							Applications and Uses
						</h2>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<h3 className="font-semibold">Business Registration</h3>
								<p className="text-muted-foreground text-sm">
									Required for company incorporation and official
									business registration in Belgium.
								</p>
							</div>
							<div className="space-y-3">
								<h3 className="font-semibold">Tax Classification</h3>
								<p className="text-muted-foreground text-sm">
									Used by tax authorities to categorize businesses for
									tax purposes and regulations.
								</p>
							</div>
							<div className="space-y-3">
								<h3 className="font-semibold">Statistical Analysis</h3>
								<p className="text-muted-foreground text-sm">
									Enables consistent economic data collection and
									analysis across different sectors.
								</p>
							</div>
							<div className="space-y-3">
								<h3 className="font-semibold">Public Procurement</h3>
								<p className="text-muted-foreground text-sm">
									Used in tender processes to specify the type of
									economic activities required.
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold border-b pb-2 mb-4">
							International Context
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							NACE is derived from the International Standard Industrial
							Classification (ISIC) developed by the United Nations. This
							ensures that European economic statistics can be compared
							internationally while maintaining the specific detail needed
							for European policy and analysis.
						</p>
						<p className="text-muted-foreground leading-relaxed">
							The classification is regularly reviewed and updated by
							Eurostat in collaboration with national statistical offices
							to ensure it remains relevant to the evolving European
							economy.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold border-b pb-2 mb-4">
							Finding the Right Code
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							Selecting the appropriate NACE-BEL code is crucial for
							businesses as it affects various administrative and legal
							obligations. The code should reflect the primary economic
							activity of the business - the activity that generates the
							most revenue or employs the most resources.
						</p>
						<p className="text-muted-foreground leading-relaxed">
							Our search tool allows you to find the most appropriate
							codes by searching through descriptions in multiple
							languages (Dutch, French, German, and English) to ensure you
							can find the right classification for your business
							activity.
						</p>
						<div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
							<p className="text-sm">
								<strong>Need help?</strong> If you're unsure about which
								code applies to your business, consult with a business
								advisor or contact the relevant Belgian authorities for
								guidance.
							</p>
						</div>
					</section>
				</div>

				<div className="text-center pt-8">
					<a
						href="/"
						className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
					>
						Start Searching NACE-BEL Codes
					</a>
				</div>
			</div>

			<PageFooter />
		</div>
	);
}
