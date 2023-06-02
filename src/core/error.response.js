'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFILCT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFILCT: 'Conflict error'
}

const {
    StatusCodes,
    ReasonPhrases
} = require('../utlis/httpStatusCode')

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

class AuthFailureError extends ErrorResponse{
    constructor( message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED){
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse{
    constructor( message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND){
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse{
    constructor( message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode)
    }
}


module.exports = {
    ConflictResquestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}