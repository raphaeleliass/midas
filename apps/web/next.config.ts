import "@midas/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.1.5", "*.ngrok-free.app"],
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:3000/api/:path*",
			},
			{
				source: "/entries/:path*",
				destination: "http://localhost:3000/entries/:path*",
			},
			{
				source: "/categories/:path*",
				destination: "http://localhost:3000/categories/:path*",
			},
			{
				source: "/billing/:path*",
				destination: "http://localhost:3000/billing/:path*",
			},
		];
	},
	typedRoutes: true,
	reactCompiler: true,
	turbopack: {
		root: "../..",
	},
};

export default nextConfig;
