import { Request, Response } from 'express';
import { LoggerService } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export type Req = Request | FastifyRequest;

export interface ExpressRes extends Response {
    send(body: any): this;
}

export interface FastifyRes extends FastifyReply {
    raw: any;
    send(body: any): this;
}

export type Res = ExpressRes | FastifyRes;

export type OnceFunction = (event: string, listener: () => void) => void;

export interface HttpLoggerOptions {
    logger?: LoggerService;
    ignorePaths?: string[];
    sensitiveHeaders?: string[];
    sanitizeHeaders?: (headers: Record<string, any>) => Record<string, any>;
    incomingRequestMessage?: (details: {
        method: string;
        url: string;
        headers: Record<string, string | string[] | undefined>;
    }) => string;
    completedRequestMessage?: (details: {
        method: string;
        url: string;
        statusCode: number;
        durationMs: string;
    }) => string;
}
