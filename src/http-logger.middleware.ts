import { Logger, LoggerService } from '@nestjs/common';
import { HttpLoggerOptions, Req } from './interfaces';
import { FastifyRequest } from 'fastify';

// Configurable logger middleware
export class HttpLoggerMiddleware {
    static create(options?: Partial<HttpLoggerOptions>) {
        const logger: LoggerService =
            options?.logger ?? new Logger(HttpLoggerMiddleware.name);

        const defaultOptions: HttpLoggerOptions = {
            ignorePaths: [],
            logger,
            incomingRequestMessage: (details) =>
                `Incoming Request: ${details.method} ${details.url} - Headers: ${JSON.stringify(details.headers)}`,
            completedRequestMessage: (details) =>
                `Completed Request: ${details.method} ${details.url} - Status: ${details.statusCode} - Duration: ${details.durationMs} ms`,
        };

        const configOptions = { ...defaultOptions, ...options };

        return (req: Req, res: any, next: () => void) => {
            const startTime = process.hrtime();

            const method = req.method;
            const url = req.url ?? (req as FastifyRequest).raw.url; // Ensure compatibility for both Express and Fastify

            const haveIgnoredPath = configOptions.ignorePaths?.some((path) =>
                url.includes(path)
            );
            if (!haveIgnoredPath) {
                const incomingRequestMessage =
                    configOptions.incomingRequestMessage?.({
                        method,
                        url,
                        headers: req.headers ?? {},
                    }) ?? `Incoming Request: ${method} ${url}`;
                logger.log(incomingRequestMessage);

                const onResponseFinish = () => {
                    const [seconds, nanoseconds] = process.hrtime(startTime);
                    const durationMs = (
                        seconds * 1e3 +
                        nanoseconds / 1e6
                    ).toFixed(2);
                    const statusCode = res.statusCode;

                    const completedRequestMessage =
                        configOptions.completedRequestMessage?.({
                            method,
                            url,
                            statusCode,
                            durationMs,
                        }) ??
                        `Completed Request: ${method} ${url} - ${statusCode} (${durationMs} ms)`;

                    if (statusCode >= 300) {
                        logger.error(completedRequestMessage);
                    } else {
                        logger.log(completedRequestMessage);
                    }
                };

                if ('once' in res && typeof res.once === 'function') {
                    res.once('finish', onResponseFinish);
                } else if (
                    'raw' in res &&
                    'once' in res.raw &&
                    typeof res.raw.once === 'function'
                ) {
                    res.raw.once('finish', onResponseFinish);
                }
            }

            next();
        };
    }
}
