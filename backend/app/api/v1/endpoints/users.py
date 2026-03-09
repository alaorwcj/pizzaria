from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Any

from app.db.session import get_db
from app.models.user import User, Address
from app.schemas import user as schemas
from app.api import deps
from app.core import security

router = APIRouter()

@router.post("/register", response_model=schemas.User)
async def register_user(
    user_in: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Staff Level Registration:
    Integrates password hashing and role assignment.
    """
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        phone_whatsapp=user_in.phone_whatsapp,
        hashed_password=security.get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    JWT Token Login:
    Authenticates user and returns access token.
    Note: form_data.username is the email.
    """
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = security.create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=schemas.User)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.get("/me/addresses", response_model=List[schemas.Address])
async def read_my_addresses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    result = await db.execute(select(Address).where(Address.user_id == current_user.id))
    return result.scalars().all()

@router.post("/me/addresses", response_model=schemas.Address)
async def create_my_address(
    address_in: schemas.AddressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    new_addr = Address(
        user_id=current_user.id,
        **address_in.model_dump()
    )
    db.add(new_addr)
    await db.commit()
    await db.refresh(new_addr)
    return new_addr
