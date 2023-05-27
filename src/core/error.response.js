'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFILCT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFILCT: 'Conflict error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictResquestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFILCT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFILCT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictResquestError,
    BadRequestError
}