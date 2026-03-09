from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.api import api_router

def create_app() -> FastAPI:
    app = FastAPI(title=settings.PROJECT_NAME)
    app.include_router(api_router, prefix=settings.API_V1_STR)
    return app

app = create_app()

@app.get("/")
def read_root():
    return {"message": "Daniel's Forneria Ecosystem API is Online 🔥"}
