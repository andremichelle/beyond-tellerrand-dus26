import {FontFaceProperties, loadFont} from "@opendaw/lib-dom"

export const Fonts = {
    Rubik: <FontFaceProperties>{
        "font-family": "Rubik",
        "font-weight": 300,
        "font-style": "normal",
        "src": "/fonts/rubik-300.woff2"
    },
    RubikBold: <FontFaceProperties>{
        "font-family": "Rubik",
        "font-weight": 400,
        "font-style": "normal",
        "src": "/fonts/rubik-400.woff2"
    }
}

export const loadFonts = () => Promise.allSettled([
    loadFont(Fonts.Rubik),
    loadFont(Fonts.RubikBold)
])
