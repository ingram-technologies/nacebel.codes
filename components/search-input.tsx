"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	placeholder: string;
}

export function SearchInput({
	searchTerm,
	setSearchTerm,
	placeholder,
}: SearchInputProps) {
	return (
		<div className="relative max-w-2xl mx-auto">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
			</div>
			<Input
				type="search"
				placeholder={placeholder}
				className="pl-10 py-6 text-base rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
		</div>
	);
}
