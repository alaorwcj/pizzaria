from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.catalog import Product, Category, Promotion
from app.schemas import catalog as schemas

router = APIRouter()

@router.get("/categories", response_model=List[schemas.Category])
async def read_categories(db: Session = Depends(get_db)):
    result = await db.execute(select(Category))
    return result.scalars().all()

@router.get("/products", response_model=List[schemas.Product])
async def read_products(
    category_id: int = None, 
    include_inactive: bool = False,
    db: Session = Depends(get_db)
):
    query = select(Product)
    if category_id:
        query = query.where(Product.category_id == category_id)
    if not include_inactive:
        query = query.where(Product.is_active == True)
    
    # Staff Rule: Hide products in stock panic
    query = query.where(Product.stock_panic == False)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/promotions", response_model=List[schemas.Promotion])
async def read_promotions(db: Session = Depends(get_db)):
    result = await db.execute(select(Promotion).where(Promotion.is_active == True))
    return result.scalars().all()
