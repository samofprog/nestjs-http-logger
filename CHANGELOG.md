# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-05-06

### Added
- Enhanced compatibility with both Express and Fastify frameworks
- Improved request and response message format with additional details
- Added support for logging headers in incoming requests 
- Enhanced high-precision response time calculation using process.hrtime
- Better error detection with differential logging for responses with status codes >= 300

### Changed
- Completely redesigned message format customization through new parameter structure
- Updated signature for incomingRequestMessage and completedRequestMessage callback functions
- Improved framework detection and adaptation for request/response handling

### Fixed
- Fixed event handling for both Express and Fastify response objects
- Ensured compatibility with both frameworks when accessing URL and status information

## [1.0.4] - 2025-02-17

### Added
- Added support for ignored paths in logging middleware to prevent logging of specific routes like Swagger assets, CSS, JS, and favicon requests.

## [1.0.2] - 2025-01-13

### Added
- Introduced the `create` static method for easier instantiation of `HttpLoggerMiddleware`.
- Added support for a custom logger by providing a `logger` option in `HttpLoggerOptions`.
- Enhanced documentation with examples for using a custom logger and the `create` method.

### Changed
- Updated middleware implementation to use the `logger` option, allowing integration with the application's global or custom logger.

## [1.0.1] - 2025-01-07
### Added
- Added keywords in `package.json` to optimize search results.

### Fixed
- Corrected an issue with the middleware that caused it to behave incorrectly with Fastify.

### Removed
- Removed unit tests to rewrite them later with improved coverage and structure.

### Updated
- Updated project documentation and README.

## [1.0.0] - 2025-01-06
### Added
- Initial release of the `http-logger-middleware` package for NestJS.
- Middleware to log HTTP requests and responses in a customizable manner.
- Support for logging incoming requests with HTTP method and URL.
- Support for logging completed requests with HTTP method, URL, status code, and duration.
- Customizable messages for logging using `HttpLoggerOptions`.
- Optional configuration for error logging for requests with status codes >= 300.
- Added MIT License to the project.

### Changed
- N/A

### Fixed
- N/A
