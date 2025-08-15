"use client";

import { Button } from "@/components/ui/button";
import type { Language, NacebelCode } from "@/types";
import { Check, Copy, ExternalLink } from "lucide-react";

const levelColorClasses: { [key: number]: string } = {
	2: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	4: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
	5: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};
const defaultCodeColor =
	"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";

interface NacebelCodeItemProps {
	code: NacebelCode;
	language: Language;
	copiedCode: string | null;
	onCopy: (code: string, description: string) => void;
	getExternalLink: (code: string) => string;
}

export function NacebelCodeItem({
	code,
	language,
	copiedCode,
	onCopy,
	getExternalLink,
}: NacebelCodeItemProps) {
	return (
		<div
			key={code.code}
			className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50"
		>
			<div className="flex-shrink-0 mr-3">
				<span
					className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${levelColorClasses[code.level] || defaultCodeColor}`}
				>
					{code.code}
				</span>
			</div>
			<div className="flex-grow">
				<p className="text-gray-900 dark:text-gray-100">
					{code.titles[language]}
				</p>
			</div>
			<div className="flex-shrink-0 ml-2 flex items-center space-x-1">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onCopy(code.code, code.titles[language])}
					className="h-8 w-8 p-0"
					aria-label="Copy to clipboard"
				>
					{copiedCode === code.code ? (
						<Check className="h-4 w-4 text-green-500" />
					) : (
						<Copy className="h-4 w-4 text-gray-400 dark:text-gray-500" />
					)}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					asChild
					className="h-8 w-8 p-0"
					aria-label="Open external link"
				>
					<a
						href={getExternalLink(code.code)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
					</a>
				</Button>
			</div>
		</div>
	);
}
