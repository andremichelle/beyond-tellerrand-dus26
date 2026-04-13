import {UUID} from "@opendaw/lib-std"

export type DrumSample = {
    readonly uuid: UUID.Bytes
    readonly uuidString: string
    readonly name: string
    readonly shortLabel: string
    readonly durationInSeconds: number
}

const sample = (uuidString: string, name: string, shortLabel: string, durationInSeconds: number): DrumSample => ({
    uuid: UUID.parse(uuidString),
    uuidString,
    name,
    shortLabel,
    durationInSeconds
})

export const TR909_SAMPLES: ReadonlyArray<DrumSample> = [
    sample("8bb2c6e8-9a6d-4d32-b7ec-1263594ef367", "909 Bassdrum", "BD", 0.5091041666666667),
    sample("0017fa18-a5eb-4d9d-b6f2-e2ddd30a3010", "909 Snare", "SD", 0.23466666666666666),
    sample("cfee850b-7658-4d08-9e3b-79d196188504", "909 Rimshot", "RIM", 0.14979166666666666),
    sample("32a6f36f-06eb-4b84-bb57-5f51103eb9e6", "909 Clap", "CLP", 0.5070208333333334),
    sample("e0ac4b39-23fb-4a56-841d-c9e0ff440cab", "909 Closed Hat", "CH", 0.15395833333333334),
    sample("51c5eea4-391c-4743-896a-859692ec1105", "909 Open Hat", "OH", 0.5022291666666666),
    sample("28d14cb9-1dc6-4193-9dd7-4e881f25f520", "909 Low Tom", "LT", 0.5094166666666666),
    sample("21f92306-d6e7-446c-a34b-b79620acfefc", "909 Mid Tom", "MT", 0.38477083333333334),
    sample("ad503883-8a72-46ab-a05b-a84149953e17", "909 High Tom", "HT", 0.5106666666666667),
    sample("42a56ff6-89b6-4f2e-8a66-5a41d316f4cb", "909 Crash", "CR", 1.0548333333333333),
    sample("87cde966-b799-4efc-a994-069e703478d3", "909 Ride", "RD", 1.7203541666666666)
]

export const BASE_PITCH = 60

export const SAMPLE_URL = (uuidString: string): string => `/samples/909/${uuidString}.wav`
