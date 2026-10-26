// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

// Exported projects may omit Lovable image manifests. Real files always win.
function missingAssetPlaceholders(): Plugin {
    const prefix = "\0missing-preview-asset:";
    const assetsDir = fileURLToPath(new URL("./src/assets/", import.meta.url));
    return {
        name: "missing-preview-asset-placeholders",
        enforce: "pre",
        resolveId(source) {
            const path = source.startsWith("@/assets/")
                ? assetsDir + source.slice("@/assets/".length)
                : source;
            if (!path.startsWith(assetsDir) || !/^[\w-]+\.asset\.json$/.test(path.slice(assetsDir.length))) return;
            if (existsSync(path)) return;
            this.warn(`Missing ${source}; using a temporary preview placeholder.`);
            return prefix + source.split("/").pop()!.replace(".asset.json", "");
        },
        load(id) {
            if (!id.startsWith(prefix)) return;
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#746455"/></svg>`;
            return `export default ${JSON.stringify({ url: `data:image/svg+xml,${encodeURIComponent(svg)}` })};`;
        },
    };
}

export default defineConfig({
    plugins: [missingAssetPlaceholders()],
    nitro: false,
    tanstackStart: {
        prerender: { enabled: true },
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        // nitro/vite builds from this
        server: { entry: "server" },
    },
});
