"""API routers."""
from app.api.endpoints import earthquakes
from fastapi import APIRouter

router = APIRouter()
router.include_router(earthquakes.router, prefix='/earthquakes', tags=['Earthquakes'])
