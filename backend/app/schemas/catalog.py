from pydantic import BaseModel
from typing import Optional, List, Any

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    category_id: int
    is_active: bool = True
    stock_panic: bool = False

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class PromotionBase(BaseModel):
    code: str
    type: str # COMBO, PERCENTAGE, FIXED
    rules: Any
    is_active: bool = True

class PromotionCreate(PromotionBase):
    pass

class Promotion(PromotionBase):
    id: int
    class Config:
        from_attributes = True
