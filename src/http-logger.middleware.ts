import { Logger, LoggerService } from '@nestjs/common';
import { HttpLoggerOptions, Req } from './interfaces';
import { FastifyRequest } from 'fastify';

type Headers = Record<string, unknown>;

const createHeaderSanitizer =
    (sensitiveKeys: readonly string[]) =>
    (headers: Headers): Headers => {
        return Object.entries(headers).reduce((acc, [key, value]) => {
            acc[key] = sensitiveKeys.includes(key.toLowerCase())
                ? '*****'
                : value;
            return acc;
        }, {} as Headers);
    };

export class HttpLoggerMiddleware {
    static create(options?: Partial<HttpLoggerOptions>) {
        const logger: LoggerService =
            options?.logger ?? new Logger(HttpLoggerMiddleware.name);
        const sensitiveHeaders = options?.sensitiveHeaders ?? [
            'authorization',
            'cookie',
            'set-cookie',
            'x-api-key',
        ];

        const sanitizeHeaders =
            options?.sanitizeHeaders ?? createHeaderSanitizer(sensitiveHeaders);

        const defaultIncomingMsg = ({
            method,
            url,
            headers,
        }: {
            method: string;
            url: string;
            headers: Headers;
        }) =>
            `Incoming request → ${method.toLowerCase()} ${url} with headers ${JSON.stringify(headers)}`;

        const defaultCompletedMsg = ({
            method,
            url,
            statusCode,
            durationMs,
        }: {
            method: string;
            url: string;
            statusCode: number;
            durationMs: string;
        }) =>
            `Completed request ← ${method.toLowerCase()} ${url}  with status ${statusCode} in ${durationMs} ms`;

        const config = {
            ignorePaths: [] as string[],
            logger,
            sensitiveHeaders,
            sanitizeHeaders,
            incomingRequestMessage: defaultIncomingMsg,
            completedRequestMessage: defaultCompletedMsg,
            ...options,
        };

        return (req: Req, res: any, next: () => void): void => {
            const startTime = process.hrtime();
            const method = req.method;
            const url = req.url ?? (req as FastifyRequest).raw.url;

            const isIgnored = config.ignorePaths.some((path) =>
                url.includes(path)
            );
            if (isIgnored) {
                next();
                return;
            }

            const sanitizedHeaders = config.sanitizeHeaders(req.headers ?? {});

            config.logger.log(
                config.incomingRequestMessage({
                    method,
                    url,
                    headers: sanitizedHeaders,
                })
            );

            const onFinish = (): void => {
                const [seconds, nanoseconds] = process.hrtime(startTime);
                const durationMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(
                    2
                );
                const statusCode: number = res.statusCode;

                const message = config.completedRequestMessage({
                    method,
                    url,
                    statusCode,
                    durationMs,
                });

                if (statusCode >= 300) {
                    config.logger.error(message);
                } else {
                    config.logger.log(message);
                }
            };

            if ('once' in res && typeof res.once === 'function') {
                res.once('finish', onFinish);
            } else if (
                'raw' in res &&
                'once' in res.raw &&
                typeof res.raw.once === 'function'
            ) {
                res.raw.once('finish', onFinish);
            }

            next();
        };
    }
}
