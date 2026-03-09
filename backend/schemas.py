from typing import List, Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    whatsapp: str = Field(..., pattern=r"^\+?[1-9]\d{1,14}$")
    address: str
    reference_point: Optional[str] = None

class OrderItemCreate(BaseModel):
    flavor_id: int
    is_half_and_half: bool = False
    flavor_2_id: Optional[int] = None
    crust_type: Optional[str] = None  # "CHEDDAR", "CHOCOLATE", or None/Default
    observation: Optional[str] = None

class OrderCreate(BaseModel):
    customer: CustomerBase
    items: List[OrderItemCreate]
    promotion_id: Optional[str] = None  # "COMBO_A" or "COMBO_B"

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    total_value: float
    status: str
    created_at: datetime
    sla_expires_at: datetime
