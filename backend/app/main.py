import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse, Response

from app.api import auth, progress, quiz, teacher, translation, tutor
from app.db.session import create_indexes

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_indexes()
        logger.info("MongoDB indexes created / verified.")
    except Exception as exc:
        logger.error(f"MongoDB startup error: {exc}")
    yield


app = FastAPI(
    title="AI Tutor API",
    description="Adaptive AI tutor for rural students — SDG 4",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tutor.router)
app.include_router(quiz.router)
app.include_router(progress.router)
app.include_router(translation.router)
app.include_router(teacher.router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db():
    """Verify MongoDB connectivity and return collection stats."""
    from pymongo.errors import ServerSelectionTimeoutError

    from app.db.session import get_db

    try:
        db = get_db()
        db.client.server_info()
        return {
            "status": "ok",
            "database": db.name,
            "collections": {
                "students": db.students.count_documents({}),
                "teachers": db.teachers.count_documents({}),
                "mastery_records": db.mastery_records.count_documents({}),
                "quiz_attempts": db.quiz_attempts.count_documents({}),
            },
        }
    except ServerSelectionTimeoutError as exc:
        from fastapi import HTTPException

        raise HTTPException(status_code=503, detail=f"MongoDB unreachable: {exc}") from exc
