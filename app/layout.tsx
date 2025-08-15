import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{children}
				<Toaster />
			</body>
		</html>
	);
}

export const metadata = {
	generator: "v0.dev",
};
