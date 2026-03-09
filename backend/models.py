from enum import Enum
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class OrderStatus(str, Enum):
    RECEIVED = "Recebido"
    PREPARING = "Em Preparo"
    SHIPPED = "Saiu para Entrega"
    DELIVERED = "Entregue"
    CANCELLED = "Cancelado"

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    whatsapp = Column(String, index=True)
    address = Column(String)
    reference_point = Column(String, nullable=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    total_value = Column(Float)
    status = Column(String, default=OrderStatus.RECEIVED)
    created_at = Column(DateTime, default=datetime.utcnow)
    sla_expires_at = Column(DateTime)
    
    customer = relationship("Customer")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    flavor_1 = Column(String)
    flavor_2 = Column(String, nullable=True)
    is_half_and_half = Column(Boolean, default=False)
    observation = Column(String, nullable=True)
    
    order = relationship("Order", back_populates="items")

# Predefined constants for validation
ALLOWED_PROMO_FLAVORS = {
    "Frango com Catupiry",
    "Calabresa",
    "Toscana",
    "Mussarela",
    "Portuguesa"
}
