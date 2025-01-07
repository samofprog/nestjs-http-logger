export interface Req {
    method: string;
    originalUrl: string;
}
export type OnceFunction = (event: string, listener: () => void) => void;
export interface Res {
    statusCode: number;
    once: OnceFunction;
}
export interface HttpLoggerOptions {
    incomingRequestMessage?: (method: string, url: string) => string;
    completedRequestMessage?: (
        method: string,
        url: string,
        statusCode: number,
        durationMs: string
    ) => string;
}
