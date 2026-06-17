import "@midas/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	turbopack: {
		root: "../..",
	},
};

export default nextConfig;
