from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    base_price = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"))
    is_active = Column(Boolean, default=True)
    stock_panic = Column(Boolean, default=False) # "Botão de Pânico"

    category = relationship("Category", back_populates="products")

class Promotion(Base):
    __tablename__ = "promotions"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    type = Column(String) # COMBO, PERCENTAGE, FIXED
    rules = Column(JSON) # Inherited Rules (Trava 1/2) logic
    is_active = Column(Boolean, default=True)
