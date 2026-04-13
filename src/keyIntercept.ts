type KeyInterceptor = (event: KeyboardEvent) => boolean

let active: KeyInterceptor | null = null

export const setKeyIntercept = (handler: KeyInterceptor | null): void => {
    active = handler
}

export const runKeyIntercept = (event: KeyboardEvent): boolean => active?.(event) ?? false
