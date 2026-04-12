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
        host: "localhost"
    },
    preview: {
        port: 8080,
        host: "localhost"
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
