from fastapi import APIRouter
from app.api.v1.endpoints import users, catalog, orders, couriers

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(catalog.router, prefix="/catalog", tags=["catalog"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(couriers.router, prefix="/couriers", tags=["couriers"])
