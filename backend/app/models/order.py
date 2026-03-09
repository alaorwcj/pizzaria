from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    address_id = Column(Integer, ForeignKey("addresses.id"))
    courier_id = Column(Integer, ForeignKey("couriers.id"), nullable=True)
    status = Column(String, default="RECEIVED") # RECEIVED, KITCHEN, DISPATCHED, DELIVERED, CANCELLED
    total_amount = Column(Float, nullable=False)
    delivery_fee = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    delivery_sla = Column(DateTime(timezone=True)) # Expected delivery time

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    courier = relationship("Courier", back_populates="orders")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    is_half_and_half = Column(Boolean, default=False)
    flavor_2_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    observation = Column(String)
    quantity = Column(Integer, default=1)

    order = relationship("Order", back_populates="items")
    addons = relationship("OrderItemAddon", back_populates="order_item")

class OrderItemAddon(Base):
    __tablename__ = "order_item_addons"

    id = Column(Integer, primary_key=True, index=True)
    order_item_id = Column(Integer, ForeignKey("order_items.id"))
    name = Column(String, nullable=False)
    extra_price = Column(Float, default=0.0)

    order_item = relationship("OrderItem", back_populates="addons")

class Courier(Base):
    __tablename__ = "couriers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vehicle_type = Column(String) # BIKE, MOTO, CAR
    is_online = Column(Boolean, default=False)

    user = relationship("User")
    orders = relationship("Order", back_populates="courier")
