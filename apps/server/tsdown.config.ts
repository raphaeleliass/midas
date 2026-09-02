import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./src/index.ts", "./src/handler.ts"],
	format: "esm",
	outDir: "./dist",
	clean: true,
	noExternal: [/@midas\/.*/],
});
