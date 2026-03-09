from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.catalog import Product

class OrderItemAddonBase(BaseModel):
    name: str
    extra_price: float

class OrderItemAddonCreate(OrderItemAddonBase):
    pass

class OrderItemAddon(OrderItemAddonBase):
    id: int
    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    is_half_and_half: bool = False
    flavor_2_id: Optional[int] = None
    observation: Optional[str] = None
    quantity: int = 1

class OrderItemCreate(OrderItemBase):
    addons: List[OrderItemAddonCreate] = []

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    addons: List[OrderItemAddon] = []
    # Optionally include product details for response
    # product: Product

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    user_id: int
    address_id: int
    total_amount: float
    delivery_fee: float = 0.0

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    promotion_code: Optional[str] = None

class Order(OrderBase):
    id: int
    status: str
    created_at: datetime
    delivery_sla: Optional[datetime] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True
