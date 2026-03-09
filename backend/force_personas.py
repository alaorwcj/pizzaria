import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User, Address
from app.models.order import Courier
from app.core.security import get_password_hash

async def enforce():
    async with AsyncSessionLocal() as db:
        # 1. Admin
        res = await db.execute(select(User).where(User.email == 'admin@daniels.com'))
        adm = res.scalar_one_or_none()
        if not adm:
            adm = User(name='Admin', email='admin@daniels.com', phone_whatsapp='11', hashed_password=get_password_hash('admin123'), role='ADMIN')
            db.add(adm)
        else:
            adm.role = 'ADMIN'
            
        # 2. Customer
        res = await db.execute(select(User).where(User.email == 'test_final@example.com'))
        cust = res.scalar_one_or_none()
        if not cust:
            cust = User(name='Test Final', email='test_final@example.com', phone_whatsapp='22', hashed_password=get_password_hash('password'), role='CUSTOMER')
            db.add(cust)
        else:
            cust.role = 'CUSTOMER'
            
        # 3. Courier
        res = await db.execute(select(User).where(User.email == 'courier@example.com'))
        cour = res.scalar_one_or_none()
        if not cour:
            cour = User(name='Motoboy', email='courier@example.com', phone_whatsapp='33', hashed_password=get_password_hash('password'), role='COURIER')
            db.add(cour)
        else:
            cour.role = 'COURIER'
            
        await db.flush()
        
        # Ensure courier profile
        res_c = await db.execute(select(Courier).where(Courier.user_id == cour.id))
        if not res_c.scalar_one_or_none():
            db.add(Courier(user_id=cour.id, vehicle_type='MOTO', is_online=True))
            
        await db.commit()
        print("Personas enforced.")

if __name__ == '__main__':
    asyncio.run(enforce())
