import { Logger, LoggerService } from '@nestjs/common';
import { NextFunction } from 'express';
import { HttpLoggerOptions, Req, Res } from './interfaces';

// Configurable logger middleware
export class HttpLoggerMiddleware {
    static create(options?: Partial<HttpLoggerOptions>) {
        // Use provided logger or default to NestJs Logger
        const logger: LoggerService =
            options?.logger ?? new Logger('HttpLoggerMiddleware');

        const defaultOptions: HttpLoggerOptions = {
            logger,
            incomingRequestMessage: (method, url) =>
                `Incoming Request: ${method} ${url}`,
            completedRequestMessage: (method, url, statusCode, durationMs) =>
                `Completed Request: ${method} ${url} - ${statusCode} (${durationMs} ms)`,
        };

        // Merge default options with user options
        const configOptions = { ...defaultOptions, ...options };

        return (req: Req, res: Res, next: NextFunction) => {
            const startTime = process.hrtime();

            const method = req.method;
            const url = req.originalUrl;

            // Log request details
            const incomingRequestMessage =
                configOptions.incomingRequestMessage?.(
                    method ?? 'UNKNOWN',
                    url ?? 'UNKNOWN'
                ) ?? `Incoming Request: ${method} ${url}`;
            logger.log(incomingRequestMessage);

            const onResponseFinish = () => {
                const [seconds, nanoseconds] = process.hrtime(startTime);
                const durationMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(
                    2
                );
                const statusCode = res.statusCode;

                const completedRequestMessage =
                    configOptions.completedRequestMessage?.(
                        method ?? 'UNKNOWN',
                        url ?? 'UNKNOWN',
                        statusCode,
                        durationMs
                    ) ??
                    `Completed Request: ${method} ${url} - ${statusCode} (${durationMs} ms)`;

                if (statusCode >= 300) {
                    logger.error(completedRequestMessage);
                } else {
                    logger.log(completedRequestMessage);
                }
            };

            res.once('finish', onResponseFinish);

            // Proceed to next middleware
            next();
        };
    }
}
