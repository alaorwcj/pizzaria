from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.db.session import get_db
from app.models.order import Order, OrderItem, OrderItemAddon, Courier
from app.models.user import User
from app.schemas import order as schemas
from app.api import deps
from app.services.logistics import calculate_delivery_fee

router = APIRouter()

@router.get("/active", response_model=List[schemas.Order])
async def read_active_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin) # STAFF Guard
):
    """
    KDS Endpoint: Returns orders that are not yet delivered or cancelled.
    Restricted to ADMIN/STAFF.
    """
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.addons))
        .where(Order.status.in_(["RECEIVED", "KITCHEN", "DISPATCHED"]))
        .order_by(Order.created_at.asc())
    )
    return result.scalars().all()

@router.post("/", response_model=schemas.Order)
async def create_order(
    order_in: schemas.OrderCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Staff Level Order Creation:
    Uses current_user for ownership.
    """
    fee = await calculate_delivery_fee(db, order_in.address_id)
    new_order = Order(
        user_id=current_user.id,
        address_id=order_in.address_id,
        total_amount=order_in.total_amount + fee,
        delivery_fee=fee,
        status="RECEIVED"
    )
    db.add(new_order)
    await db.flush()
    
    for item_data in order_in.items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item_data.product_id,
            is_half_and_half=item_data.is_half_and_half,
            flavor_2_id=item_data.flavor_2_id,
            observation=item_data.observation,
            quantity=item_data.quantity
        )
        db.add(order_item)
        await db.flush()
        
        for addon_data in item_data.addons:
            addon = OrderItemAddon(
                order_item_id=order_item.id,
                name=addon_data.name,
                extra_price=addon_data.extra_price
            )
            db.add(addon)
            
    await db.commit()
    
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.addons))
        .where(Order.id == new_order.id)
    )
    return result.scalar_one()

@router.patch("/{order_id}/status", response_model=schemas.Order)
async def update_order_status(
    order_id: int, 
    status: str, 
    courier_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Auth Logic: ADMIN can do anything, COURIER can only update their own assigned orders
    if current_user.role == "ADMIN":
        pass
    elif current_user.role == "COURIER":
        res_c = await db.execute(select(Courier).where(Courier.user_id == current_user.id))
        courier = res_c.scalar_one_or_none()
        if not courier or order.courier_id != courier.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this order")
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    order.status = status
    if courier_id: # Admin can reassign
        order.courier_id = courier_id
        
    await db.commit()
    
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.addons))
        .where(Order.id == order_id)
    )
    return result.scalar_one()

@router.get("/me", response_model=List[schemas.Order])
async def read_my_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Returns order history for the logged-in customer.
    """
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.addons))
        .where(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()

@router.get("/{order_id}", response_model=schemas.Order)
async def read_order(
    order_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.addons))
        .where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Security: Only owner or admin can see order details
    if order.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not enough privileges")
        
    return order
