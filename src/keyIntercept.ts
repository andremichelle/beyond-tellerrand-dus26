type KeyInterceptor = (event: KeyboardEvent) => boolean

let active: KeyInterceptor | null = null

export const setKeyIntercept = (handler: KeyInterceptor | null): void => {
    active = handler
}

export const runKeyIntercept = (event: KeyboardEvent): boolean => active?.(event) ?? false

export type NavDirection = "forward" | "backward"
let pendingDirection: NavDirection | null = null

export const setPendingNavDirection = (direction: NavDirection | null): void => {
    pendingDirection = direction
}

export const consumePendingNavDirection = (): NavDirection | null => {
    const value = pendingDirection
    pendingDirection = null
    return value
}
