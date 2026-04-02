"use client";

import { Fragment } from "react";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	translations: any;
}

export function PaginationControls({
	currentPage,
	totalPages,
	setCurrentPage,
	translations,
}: PaginationControlsProps) {
	const getVisiblePages = (page: number, pages: number) => {
		const visiblePages: number[] = [];
		const left = Math.max(1, page - 2);
		const right = Math.min(pages, page + 2);

		visiblePages.push(1);
		for (let pageNumber = left; pageNumber <= right; pageNumber += 1) {
			visiblePages.push(pageNumber);
		}
		visiblePages.push(pages);

		return Array.from(new Set(visiblePages)).sort((a, b) => a - b);
	};

	if (totalPages <= 1) return null;

	const clampedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
	const visiblePages = getVisiblePages(clampedCurrentPage, totalPages);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Pagination className="justify-start sm:justify-center">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						label={translations.previous}
						onClick={() =>
							handlePageChange(Math.max(1, clampedCurrentPage - 1))
						}
						disabled={clampedCurrentPage <= 1}
					/>
				</PaginationItem>
				{visiblePages.map((page, index) => {
					const previousPage = visiblePages[index - 1];

					return (
						<Fragment key={`page-fragment-${page}`}>
							{index > 0
							&& typeof previousPage === "number"
							&& page - previousPage > 1 ? (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							) : null}
							<PaginationItem>
								<PaginationLink
									isActive={page === clampedCurrentPage}
									onClick={() => handlePageChange(page)}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						</Fragment>
					);
				})}
				<PaginationItem>
					<PaginationNext
						label={translations.next}
						onClick={() =>
							handlePageChange(
								Math.min(totalPages, clampedCurrentPage + 1),
							)
						}
						disabled={clampedCurrentPage >= totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
