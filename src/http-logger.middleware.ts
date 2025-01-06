import { Logger } from '@nestjs/common';
import { NextFunction } from 'express';
import { HttpLoggerOptions } from './http-logger-options.interface';
import { IncomingMessage, ServerResponse } from 'http';
// Configurable logger middleware
export function HttpLoggerMiddleware(options?: HttpLoggerOptions) {
    const logger = new Logger(HttpLoggerMiddleware.name);

    const defaultOptions: HttpLoggerOptions = {
        incomingRequestMessage: (method, url) =>
            `Incoming Request: ${method} ${url}`,
        completedRequestMessage: (method, url, statusCode, durationMs) =>
            `Completed Request: ${method} ${url} - ${statusCode} (${durationMs} ms)`,
    };

    // Use provided options or default options
    const configOptions = options ?? defaultOptions;

    return (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
        const startTime = process.hrtime();

        const method = req.method;
        const url = req.url;

        // Log request details
        const incomingRequestMessage =
            configOptions.incomingRequestMessage?.(
                method ?? 'UNKNOWN',
                url ?? 'UNKNOWN'
            ) ?? `Incoming Request: ${method} ${url}`;
        logger.log(incomingRequestMessage);

        const onResponseFinish = () => {
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const durationMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2);
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
        // Call next middleware
        next();
    };
}