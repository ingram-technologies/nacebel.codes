"use client";

export function AdvertisementBanner() {
	return (
		<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
			<a
				href="https://dashboard.beldoc.be"
				target="_blank"
				rel="noopener noreferrer"
				className="block hover:opacity-80 transition-opacity"
			>
				<p className="text-blue-800 dark:text-blue-200 font-medium">
					💼 Incorporate your company cheaper and entirely online via our new
					platform:{" "}
					<span className="font-bold text-blue-900 dark:text-blue-100">
						Beldoc
					</span>
				</p>
			</a>
		</div>
	);
}
