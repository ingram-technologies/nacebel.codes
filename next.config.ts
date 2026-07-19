import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		useTypeScriptCli: true,
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
