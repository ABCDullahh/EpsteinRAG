from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.utils.exceptions import EpsteinRAGException
from app.utils.logger import get_logger

logger = get_logger(__name__)


def setup_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(EpsteinRAGException)
    async def custom_exception_handler(request: Request, exc: EpsteinRAGException):
        logger.warning("handled_error", status=exc.status_code, message=exc.message)
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error("unhandled_error", error=str(exc), exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"},
        )
