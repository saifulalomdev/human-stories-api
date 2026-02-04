export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        // This line is for internal JS engines to keep the stack trace clean
        Object.setPrototypeOf(this, AppError.prototype);
    }
}