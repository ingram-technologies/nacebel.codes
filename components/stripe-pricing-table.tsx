"use client";

import type React from "react";

import Script from "next/script";

// This declaration informs TypeScript about the custom <stripe-pricing-table> element.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			"stripe-pricing-table": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & {
				"pricing-table-id": string;
				"publishable-key": string;
			};
		}
	}
}

export function StripePricingTable() {
	return (
		<>
			<Script async src="https://js.stripe.com/v3/pricing-table.js" />
			<stripe-pricing-table
				pricing-table-id="prctbl_1RgCsxL59l0V9ECiyyiMraaX"
				publishable-key="pk_live_51IYsMjL59l0V9ECiJ4d4ub66GzG75E6gE9YHEqMixNa5h6HThsCejIhhEBgQdcfseDeQvGgCXVoAbeleZi6aME3b00z8FVrsXQ"
			/>
		</>
	);
}
