"""
Darwaza API - Main Application Entry Point
A Kuwaiti Cultural Heritage Platform
"""
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import logging

from config import CORS_ORIGINS
from database import close_db_connection
from routers import (
    auth_router,
    ai_router,
    marketplace_router,
    councils_router,
    subscriptions_router,
    payments_router,
    content_router
)
from routers.webhooks import router as webhooks_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Darwaza API",
    description="دروازة - منصة التراث الثقافي الكويتي",
    version="2.0.0"
)

# Include all routers under /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(marketplace_router, prefix="/api")
app.include_router(councils_router, prefix="/api")
app.include_router(subscriptions_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(content_router, prefix="/api")
app.include_router(webhooks_router, prefix="/api")


# Health and root endpoints
@app.get("/api/")
async def root():
    return {"message": "Welcome to Darwaza API", "version": "2.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Shutdown handler
@app.on_event("shutdown")
async def shutdown_event():
    await close_db_connection()
