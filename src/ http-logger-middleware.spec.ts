import { HttpLoggerMiddleware } from './http-logger.middleware';
import { Logger } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

describe('HttpLoggerMiddleware', () => {
    let loggerLogSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    let nextMock: jest.Mock;

    beforeEach(() => {
        loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
        loggerErrorSpy = jest
            .spyOn(Logger.prototype, 'error')
            .mockImplementation();
        nextMock = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log the incoming request message', () => {
        const req = { method: 'GET', url: '/test' } as IncomingMessage;
        const res = new ServerResponse(req);
        const middleware = HttpLoggerMiddleware();

        middleware(req, res, nextMock);

        expect(loggerLogSpy).toHaveBeenCalledWith(
            'Incoming Request: GET /test'
        );
        expect(nextMock).toHaveBeenCalled();
    });

    it('should log the completed request message with status 200', () => {
        const req = { method: 'GET', url: '/test' } as IncomingMessage;
        const res = new ServerResponse(req);
        const middleware = HttpLoggerMiddleware();

        middleware(req, res, nextMock);

        res.statusCode = 200;
        res.emit('finish');

        expect(loggerLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('Completed Request: GET /test - 200')
        );
        expect(nextMock).toHaveBeenCalled();
    });

    it('should log an error for status code >= 300', () => {
        const req = { method: 'POST', url: '/error' } as IncomingMessage;
        const res = new ServerResponse(req);
        const middleware = HttpLoggerMiddleware();

        middleware(req, res, nextMock);

        res.statusCode = 404;
        res.emit('finish');

        expect(loggerErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Completed Request: POST /error - 404')
        );
        expect(nextMock).toHaveBeenCalled();
    });

    it('should use custom messages if options are provided', () => {
        const req = { method: 'PUT', url: '/custom' } as IncomingMessage;
        const res = new ServerResponse(req);
        const middleware = HttpLoggerMiddleware({
            incomingRequestMessage: (method, url) =>
                `Custom Incoming: ${method} ${url}`,
            completedRequestMessage: (method, url, statusCode, durationMs) =>
                `Custom Completed: ${method} ${url} - ${statusCode} in ${durationMs}ms`,
        });

        middleware(req, res, nextMock);

        res.statusCode = 201;
        res.emit('finish');

        expect(loggerLogSpy).toHaveBeenCalledWith(
            'Custom Incoming: PUT /custom'
        );
        expect(loggerLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('Custom Completed: PUT /custom - 201')
        );
        expect(nextMock).toHaveBeenCalled();
    });

    it('should handle unknown method and URL gracefully', () => {
        const req = {
            method: undefined,
            url: undefined,
        } as unknown as IncomingMessage;
        const res = new ServerResponse(req);
        const middleware = HttpLoggerMiddleware();

        middleware(req, res, nextMock);

        res.statusCode = 200;
        res.emit('finish');

        expect(loggerLogSpy).toHaveBeenCalledWith(
            'Incoming Request: UNKNOWN UNKNOWN'
        );
        expect(loggerLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('Completed Request: UNKNOWN UNKNOWN - 200')
        );
        expect(nextMock).toHaveBeenCalled();
    });
});
