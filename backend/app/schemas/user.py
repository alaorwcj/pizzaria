from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone_whatsapp: str
    role: Optional[str] = "CUSTOMER"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class AddressBase(BaseModel):
    street: str
    city: str
    zip_code: str
    reference_point: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class AddressCreate(AddressBase):
    pass

class Address(AddressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
