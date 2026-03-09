from pydantic import BaseModel
from typing import List, Optional
from app.schemas.user import User

class CourierBase(BaseModel):
    vehicle_type: str # BIKE, MOTO, CAR
    is_online: bool = False

class CourierCreate(CourierBase):
    pass

class Courier(CourierBase):
    id: int
    user_id: int
    user: Optional[User] = None

    class Config:
        from_attributes = True

class CourierUpdate(BaseModel):
    is_online: Optional[bool] = None
    vehicle_type: Optional[str] = None
