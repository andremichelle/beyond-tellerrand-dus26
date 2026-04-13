import {resolve} from "path"
import {readFileSync} from "fs"
import {defineConfig} from "vite"

export default defineConfig(({command}) => ({
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
}))
