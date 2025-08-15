"use client";

export function PageFooter() {
	return (
		<footer className="text-center py-8 mt-12 border-t border-gray-200 dark:border-gray-700">
			<div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
				<p>
					© 2025{" "}
					<a
						href="https://ingram.tech"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
					>
						Ingram Technologies
					</a>
					. All rights reserved.
				</p>
				<p>
					<a
						href="mailto:contact@nacebel.codes"
						className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
					>
						contact@nacebel.codes
					</a>
				</p>
			</div>
		</footer>
	);
}
