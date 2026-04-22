import css from "./OpenDAWAmbassadorsSlide.sass?inline"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"
import {Slide} from "@/Slide"

const className = Html.adoptStyleSheet(css, "OpenDAWAmbassadors")

type Ambassador = {
    name: string
    image: string
    bio: string
}

const AMBASSADORS: ReadonlyArray<Ambassador> = [
    {
        name: "Eric D. Clark",
        image: "/ambassadors/ericdclark.webp",
        bio: "Four decades of DJing, production, and curation, from San Francisco clubs to Parisian nightlife and Whirlpool Productions."
    },
    {
        name: "polarity",
        image: "/ambassadors/polarity.webp",
        bio: "Electronic music producer and open source advocate behind producer-network.de and a 30k subscriber Bitwig tutorial channel."
    },
    {
        name: "Daniel Yehezkeli",
        image: "/ambassadors/yehezkeli.webp",
        bio: "Composer and music education innovator, Audio Director at Amstad Digital, teaching game composition at multiple music colleges."
    },
    {
        name: "Marco Kuhn",
        image: "/ambassadors/marco.webp",
        bio: "Professor of Music Informatics and Sound Synthesis at the Berlin School of Popular Arts, researching human computer interaction in music."
    },
    {
        name: "Damian Paderta",
        image: "/ambassadors/damian.webp",
        bio: "Digital consultant and web geographer in Bonn, working on open infrastructures and accessible music production."
    }
]

export const OpenDAWAmbassadorsSlide = () => (
    <Slide eyebrow="openDAW" headline="Meet the openDAW Ambassadors.">
        <div class={className}>
            <div class="grid">
                {AMBASSADORS.map(({name, image, bio}) => (
                    <div class="card">
                        <img src={image} alt={name}/>
                        <div class="name">{name}</div>
                        <p class="bio">{bio}</p>
                    </div>
                ))}
            </div>
        </div>
    </Slide>
)
