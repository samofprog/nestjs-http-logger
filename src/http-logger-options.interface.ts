export interface HttpLoggerOptions {
    incomingRequestMessage?: (method: string, url: string) => string;
    completedRequestMessage?: (
        method: string,
        url: string,
        statusCode: number,
        durationMs: string
    ) => string;
}
