import {resolve} from "path"
import {readFileSync, copyFileSync, existsSync} from "fs"
import {defineConfig, type Plugin} from "vite"

const REPO_BASE = "/beyond-tellerrand-dus26"

const ASSET_PREFIXES = "8bitboy|ambassadors|basementmx|fonts|images|misc|opendaw|pulsate|samples|scripts"

const rewritePublicPaths = (basePrefix: string): Plugin => ({
    name: "rewrite-public-paths",
    enforce: "pre",
    transform(code, id) {
        if (basePrefix === "") {return null}
        if (id.includes("node_modules")) {return null}
        if (!/\.(ts|tsx|js|jsx)$/.test(id)) {return null}
        const re = new RegExp(`(["'\`])(/(?:${ASSET_PREFIXES})/)`, "g")
        const out = code.replace(re, `$1${basePrefix}$2`)
        if (out === code) {return null}
        return {code: out, map: null}
    }
})

const spa404Fallback = (): Plugin => ({
    name: "spa-404-fallback",
    apply: "build",
    closeBundle() {
        const dist = resolve(__dirname, "dist")
        const idx = resolve(dist, "index.html")
        if (existsSync(idx)) {
            copyFileSync(idx, resolve(dist, "404.html"))
        }
    }
})

export default defineConfig(({command}) => {
    const isBuild = command === "build"
    const basePrefix = isBuild ? REPO_BASE : ""
    return {
        base: isBuild ? `${REPO_BASE}/` : "/",
        resolve: {
            alias: {
                "@": resolve(__dirname, "./src")
            }
        },
        server: {
            port: 8080,
            host: "localhost",
            headers: {
                "Cross-Origin-Opener-Policy": "same-origin",
                "Cross-Origin-Embedder-Policy": "credentialless"
            }
        },
        preview: {
            port: 8080,
            host: "localhost",
            headers: {
                "Cross-Origin-Opener-Policy": "same-origin",
                "Cross-Origin-Embedder-Policy": "credentialless"
            }
        },
        esbuild: {
            target: "esnext"
        },
        build: {
            target: "esnext",
            sourcemap: true
        },
        plugins: [
            rewritePublicPaths(basePrefix),
            spa404Fallback(),
            {
                name: "spa-fallback",
                configureServer(server) {
                    server.middlewares.use((req, _res, next) => {
                        const url = req.url
                        if (command === "serve" && url !== undefined && url.indexOf(".") === -1 && !url.startsWith("/@")) {
                            const indexPath = resolve(__dirname, "index.html")
                            req.url = "/index.html"
                            const html = readFileSync(indexPath, "utf-8")
                            server.transformIndexHtml(url, html).then(transformed => {
                                _res.setHeader("Content-Type", "text/html")
                                _res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
                                _res.setHeader("Cross-Origin-Embedder-Policy", "credentialless")
                                _res.end(transformed)
                            }).catch(next)
                            return
                        }
                        next()
                    })
                }
            }
        ]
    }
})
