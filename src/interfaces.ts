import { Request, Response } from 'express';
import { LoggerService } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

// Union type for Req, can be either ExpressReq or FastifyReq
export type Req = Request | FastifyRequest;

// Extending Res interface to match the Express and Fastify Response interfaces
export interface ExpressRes extends Response {
    send(body: any): this;
}

export interface FastifyRes extends FastifyReply {
    raw: any; // Adding `raw` property for Fastify (access to the raw response object)
    send(body: any): this;
}

// Union type for Res, can be either ExpressRes or FastifyRes
export type Res = ExpressRes | FastifyRes;

// Custom type for once function to handle event listeners
export type OnceFunction = (event: string, listener: () => void) => void;

// Interface for configuring the logger middleware
export interface HttpLoggerOptions {
    logger?: LoggerService; // Custom logger to use, default to NestJS Logger if not provided
    ignorePaths?: string[]; // List of paths to ignore for logging
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
