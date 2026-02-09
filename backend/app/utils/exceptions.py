class EpsteinRAGException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ValidationError(EpsteinRAGException):
    def __init__(self, message: str):
        super().__init__(message, status_code=422)


class AuthenticationError(EpsteinRAGException):
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status_code=401)


class NotFoundError(EpsteinRAGException):
    def __init__(self, resource: str):
        super().__init__(f"{resource} not found", status_code=404)


class ExternalServiceError(EpsteinRAGException):
    def __init__(self, service: str, message: str):
        super().__init__(f"{service}: {message}", status_code=503)
