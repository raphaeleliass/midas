import { env } from "@midas/env/web";
import type { NextConfig } from "next";

const serverUrl = env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "");

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
		];
	},
	typedRoutes: true,
	reactCompiler: true,
	turbopack: {
		root: "../..",
	},
};

export default nextConfig;
