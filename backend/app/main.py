from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response, JSONResponse
from app.db.session import create_indexes
from app.api import auth, tutor, quiz, progress, translation, teacher
import logging

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
    allow_origins=["*"],   # tighten to your domain in production
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
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )


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
    from app.db.session import get_db
    from pymongo.errors import ServerSelectionTimeoutError
    try:
        db = get_db()
        # Force a real round-trip with a 2-second timeout
        db.client.server_info()
        students   = db.students.count_documents({})
        teachers   = db.teachers.count_documents({})
        mastery    = db.mastery_records.count_documents({})
        attempts   = db.quiz_attempts.count_documents({})
        return {
            "status": "ok",
            "database": db.name,
            "collections": {
                "students":       students,
                "teachers":       teachers,
                "mastery_records": mastery,
                "quiz_attempts":  attempts,
            },
        }
    except ServerSelectionTimeoutError as exc:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=f"MongoDB unreachable: {exc}")
