from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List
from app.db.session import get_db
from app.models.order import Courier, Order, OrderItem
from app.models.user import User
from app.schemas import courier as schemas
from app.schemas import order as order_schemas
from app.api import deps

router = APIRouter()

@router.get("/me", response_model=schemas.Courier)
async def read_courier_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get current user's courier profile.
    """
    result = await db.execute(select(Courier).where(Courier.user_id == current_user.id))
    courier = result.scalar_one_or_none()
    if not courier:
        raise HTTPException(status_code=404, detail="Courier profile not found")
    return courier

@router.post("/register", response_model=schemas.Courier)
async def register_as_courier(
    courier_in: schemas.CourierCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Register current user as a Courier.
    """
    # Check if already a courier
    result = await db.execute(select(Courier).where(Courier.user_id == current_user.id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already registered as courier")
    
    new_courier = Courier(
        user_id=current_user.id,
        vehicle_type=courier_in.vehicle_type,
        is_online=courier_in.is_online
    )
    db.add(new_courier)
    
    # Update user role if not already
    current_user.role = "COURIER"
    
    await db.commit()
    await db.refresh(new_courier)
    return new_courier

@router.get("/online", response_model=List[schemas.Courier])
async def read_online_couriers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin)
):
    """
    List online riders (Admin view).
    """
    result = await db.execute(
        select(Courier)
        .options(selectinload(Courier.user))
        .where(Courier.is_online == True)
    )
    return result.scalars().all()

@router.patch("/status", response_model=schemas.Courier)
async def update_courier_status(
    status_in: schemas.CourierUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Toggle online status or vehicle.
    """
    result = await db.execute(select(Courier).where(Courier.user_id == current_user.id))
    courier = result.scalar_one_or_none()
    if not courier:
        raise HTTPException(status_code=404, detail="Courier profile not found")
    
    if status_in.is_online is not None:
        courier.is_online = status_in.is_online
    if status_in.vehicle_type:
        courier.vehicle_type = status_in.vehicle_type
        
    await db.commit()
    await db.refresh(courier)
    return courier

@router.get("/my-deliveries", response_model=List[order_schemas.Order])
async def read_my_deliveries(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    List orders assigned to the courier.
    """
    result = await db.execute(select(Courier).where(Courier.user_id == current_user.id))
    courier = result.scalar_one_or_none()
    if not courier:
        raise HTTPException(status_code=403, detail="Not a courier")
        
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.addons))
        .where(Order.courier_id == courier.id)
        .where(Order.status.in_(["DISPATCHED", "DELIVERED"]))
    )
    return result.scalars().all()
