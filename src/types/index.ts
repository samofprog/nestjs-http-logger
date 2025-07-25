import { Request, Response } from 'express';
import {
    InjectionToken,
    LoggerService,
    OptionalFactoryDependency,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

// Request and Response types
export type Req = Request | FastifyRequest;

export interface ExpressRes extends Response {
    statusCode: number;
}

export interface FastifyRes extends FastifyReply {
    statusCode: number;
}

export type Res = ExpressRes | FastifyRes;

// Headers type
export type Headers = Record<string, string | string[] | undefined>;

// Request details for logging
export interface RequestDetails {
    method: string;
    url: string;
    headers: Headers;
    body?: unknown;
}

export interface CompletedRequestDetails {
    method: string;
    url: string;
    statusCode: number;
    durationMs: string;
    responseData?: unknown;
}

// Configuration interfaces
export interface SanitizerConfig {
    sensitiveHeaders?: string[];
    sanitizeHeaders?: (headers: Headers) => Headers;
}

export interface FormatterConfig {
    incomingRequestMessage?: (details: RequestDetails) => string;
    completedRequestMessage?: (details: CompletedRequestDetails) => string;
}

export interface PathMatcherConfig {
    ignorePaths?: string[];
}

export interface LoggerConfig {
    logger?: LoggerService;
    logHeaders?: boolean;
    logRequestBody?: boolean;
}

// Main configuration interface
export interface HttpLoggerOptions
    extends SanitizerConfig,
        FormatterConfig,
        PathMatcherConfig,
        LoggerConfig {}

// Module configuration interfaces
export type HttpLoggerModuleOptions = Partial<HttpLoggerOptions>;

export interface HttpLoggerAsyncOptions {
    useFactory: (
        ...args: unknown[]
    ) => Promise<HttpLoggerModuleOptions> | HttpLoggerModuleOptions;
    inject?: (InjectionToken | OptionalFactoryDependency)[];
}

// Utility types
export type PathPattern = string | RegExp;
