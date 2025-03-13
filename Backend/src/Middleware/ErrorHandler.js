// Custom Error class
class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Custom error instances
    if (err instanceof ExpressError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Mongoose duplicate key error
    if (err.code && err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate field value entered.' });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired.' });
    }
    
    // Default to 500 server error
    res.status(500).json({
        message: err.message || 'Server Error'
    });
};

export { ExpressError, errorHandler };