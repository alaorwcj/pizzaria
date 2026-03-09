import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User, Address
from app.core.security import get_password_hash

async def force_create():
    async with AsyncSessionLocal() as db:
        # Check if user exists
        result = await db.execute(select(User).where(User.email == 'test_final@example.com'))
        user = result.scalar_one_or_none()
        
        if user:
            print("User exists. Updating password.")
            user.hashed_password = get_password_hash('password')
        else:
            print("User does not exist. Creating.")
            user = User(
                name='Test Final',
                email='test_final@example.com',
                phone_whatsapp='5511988888888',
                hashed_password=get_password_hash('password'),
                role='CUSTOMER'
            )
            db.add(user)
            await db.flush()
            
        # Ensure address exists
        addr_res = await db.execute(select(Address).where(Address.user_id == user.id))
        addr = addr_res.scalar_one_or_none()
        if not addr:
            print("Creating address.")
            addr = Address(
                user_id=user.id,
                street='Av. Paulista, 1000',
                city='São Paulo',
                zip_code='01310-100',
                lat=-23.550520,
                lng=-46.633308
            )
            db.add(addr)
            
        await db.commit()
        print("Done!")

if __name__ == '__main__':
    asyncio.run(force_create())
