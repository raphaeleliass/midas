import { env } from "@midas/env/web";
import type { NextConfig } from "next";

// The browser reaches Next through ngrok in remote development, but Next should
// proxy API requests straight to the local server to avoid a tunnel loop.
const serverUrl =
	process.env.NODE_ENV === "development"
		? "http://127.0.0.1:3000"
		: env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "");

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.1.5", "*.ngrok-free.app"],
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${serverUrl}/api/:path*`,
			},
			{
				source: "/entries",
				destination: `${serverUrl}/entries`,
			},
			{
				source: "/entries/:path*",
				destination: `${serverUrl}/entries/:path*`,
			},
			{
				source: "/categories",
				destination: `${serverUrl}/categories`,
			},
			{
				source: "/categories/:path*",
				destination: `${serverUrl}/categories/:path*`,
			},
			{
				source: "/goals",
				destination: `${serverUrl}/goals`,
			},
			{
				source: "/goals/:path*",
				destination: `${serverUrl}/goals/:path*`,
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
