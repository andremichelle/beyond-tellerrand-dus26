/*! coi-serviceworker v0.1.7 - Guido Zuidhof and contributors, licensed under MIT */
let coepCredentialless = false
if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting())
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()))
    self.addEventListener("message", (ev) => {
        if (!ev.data) {return}
        if (ev.data.type === "deregister") {
            self.registration.unregister().then(() => self.clients.matchAll()).then((clients) => {
                clients.forEach((client) => client.navigate(client.url))
            })
        } else if (ev.data.type === "coepCredentialless") {
            coepCredentialless = ev.data.value
        }
    })
    self.addEventListener("fetch", (event) => {
        const request = event.request
        if (request.cache === "only-if-cached" && request.mode !== "same-origin") {return}
        const modifiedRequest = coepCredentialless && request.mode === "no-cors"
            ? new Request(request, {credentials: "omit"})
            : request
        event.respondWith(
            fetch(modifiedRequest)
                .then((response) => {
                    if (response.status === 0) {return response}
                    const newHeaders = new Headers(response.headers)
                    newHeaders.set("Cross-Origin-Embedder-Policy",
                        coepCredentialless ? "credentialless" : "require-corp")
                    if (!coepCredentialless) {
                        newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin")
                    }
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin")
                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders
                    })
                })
                .catch((error) => console.error(error))
        )
    })
} else {
    (() => {
        const reloadedBySelf = window.sessionStorage.getItem("coiReloadedBySelf")
        window.sessionStorage.removeItem("coiReloadedBySelf")
        const coepDegrading = reloadedBySelf === "coepdegrade"
        if (window.crossOriginIsolated !== false) {return}
        if (!window.isSecureContext) {
            console.log("COOP/COEP Service Worker not registered, not a secure context.")
            return
        }
        if (!navigator.serviceWorker) {
            console.log("COOP/COEP Service Worker not registered, no Service Worker support.")
            return
        }
        const n = navigator.serviceWorker
        n.register(window.document.currentScript.src).then(
            (registration) => {
                console.log("COOP/COEP Service Worker registered", registration.scope)
                registration.addEventListener("updatefound", () => {
                    console.log("Reloading page to make use of updated COOP/COEP Service Worker.")
                    window.sessionStorage.setItem("coiReloadedBySelf", "updatefound")
                    window.location.reload()
                })
                if (registration.active && !n.controller) {
                    console.log("Reloading page to make use of COOP/COEP Service Worker.")
                    window.sessionStorage.setItem("coiReloadedBySelf", "notcontrolling")
                    window.location.reload()
                }
                registration.active?.postMessage({
                    type: "coepCredentialless",
                    value: coepDegrading || document.currentScript.dataset.coepCredentialless === "true"
                })
            },
            (err) => {
                console.error("COOP/COEP Service Worker failed to register:", err)
            }
        )
    })()
}
