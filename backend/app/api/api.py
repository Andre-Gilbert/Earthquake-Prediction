"""API routers."""
from app.api.endpoints import earthquake
from fastapi import APIRouter

router = APIRouter()
router.include_router(earthquake.router, prefix='/earthquake', tags=['Earthquake'])
