from math import radians, cos, sin, asin, sqrt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import Address

# Dani's Store Location (Default)
STORE_LAT = -23.550520
STORE_LNG = -46.633308

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r

async def calculate_delivery_fee(db: AsyncSession, address_id: int) -> float:
    """
    Staff Level Logistics: 
    Calculates fee based on km. 
    R$ 5.00 base + R$ 2.00 per km.
    """
    result = await db.execute(select(Address).where(Address.id == address_id))
    addr = result.scalar_one_or_none()
    
    if not addr or addr.lat is None or addr.lng is None:
        return 5.0 # Flat fallback
    
    dist = haversine(STORE_LAT, STORE_LNG, addr.lat, addr.lng)
    fee = 5.0 + (dist * 2.0)
    return round(fee, 2)
