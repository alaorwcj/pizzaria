import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.catalog import Category, Product, Promotion
from app.models.user import User, Address
from app.core.security import get_password_hash

async def get_or_create_category(db, name):
    result = await db.execute(select(Category).where(Category.name == name))
    cat = result.scalar_one_or_none()
    if not cat:
        cat = Category(name=name)
        db.add(cat)
        await db.flush()
    return cat

async def seed():
    async with AsyncSessionLocal() as db:
        # 1. Categories
        pizza_cat = await get_or_create_category(db, "Pizzas Artesanais")
        drinks_cat = await get_or_create_category(db, "Bebidas")
        
        # 2. Products
        result = await db.execute(select(Product).limit(1))
        if not result.scalar_one_or_none():
            flavors = [
                ("Mussarela", "Molho de tomate pelati, mussarela especial, orégano.", 45.00),
                ("Calabresa", "Mussarela, calabresa fatiada, cebola roxa e azeitonas.", 48.00),
                ("Margherita", "Manjericão fresco, tomate, mussarela e parmesão.", 50.00),
            ]
            for name, desc, price in flavors:
                db.add(Product(name=name, description=desc, base_price=price, category_id=pizza_cat.id))
            db.add(Product(name="Coca-Cola 2L", description="Gelada.", base_price=12.00, category_id=drinks_cat.id))

        # 3. Admin
        res_admin = await db.execute(select(User).where(User.email == 'admin@daniels.com'))
        admin = res_admin.scalar_one_or_none()
        if not admin:
            admin = User(
                name="Daniel Admin",
                email="admin@daniels.com",
                phone_whatsapp="5511999999999",
                hashed_password=get_password_hash("admin123"),
                role="ADMIN"
            )
            db.add(admin)
            await db.flush()

        # 4. Test User
        res_test = await db.execute(select(User).where(User.email == 'test_final@example.com'))
        test_user = res_test.scalar_one_or_none()
        if not test_user:
            test_user = User(
                name="Test Final",
                email="test_final@example.com",
                phone_whatsapp="5511988888888",
                hashed_password=get_password_hash("password"),
                role="CUSTOMER"
            )
            db.add(test_user)
            await db.flush()
        else:
            # Force password update to be sure
            test_user.hashed_password = get_password_hash("password")

        # 5. Address for Test User
        res_addr = await db.execute(select(Address).where(Address.user_id == test_user.id))
        if not res_addr.scalar_one_or_none():
            addr = Address(
                user_id=test_user.id,
                street="Av. Paulista, 1000",
                city="São Paulo",
                zip_code="01310-100",
                lat=-23.550520,
                lng=-46.633308
            )
            db.add(addr)

        await db.commit()
        print("Seed completed! Admin and Test User ready. 🔥")

if __name__ == "__main__":
    asyncio.run(seed())
