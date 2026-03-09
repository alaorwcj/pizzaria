import requests
import json

BASE_URL = "http://localhost:8000"

def test_invalid_promo_flavor():
    order = {
        "customer": {
            "name": "João Silva",
            "whatsapp": "11912809999",
            "address": "Rua das Flores, 123"
        },
        "items": [
            {"flavor_id": 6, "is_half_and_half": False} # 6 is Quatro Queijos (Not allowed in combo)
        ],
        "promotion_id": "COMBO_A"
    }
    # This shouldn't work until the server is running, but let's define the tests
    print("Testing invalid flavor in combo...")
    return order

def test_invalid_half_and_half_in_promo():
    order = {
        "customer": {
            "name": "João Silva",
            "whatsapp": "11912809999",
            "address": "Rua das Flores, 123"
        },
        "items": [
            {"flavor_id": 1, "is_half_and_half": True, "flavor_2_id": 2}
        ],
        "promotion_id": "COMBO_B"
    }
    print("Testing half-and-half in combo...")
    return order

if __name__ == "__main__":
    # Logic to simulate validation since we are not running uvicorn in background yet
    from main import validate_promotion
    import schemas
    from fastapi import HTTPException
    
    print("Running internal validation tests...")
    
    # Test 1
    try:
        order_data = test_invalid_promo_flavor()
        validate_promotion(schemas.OrderCreate(**order_data))
        print("FAIL: Invalid flavor was accepted")
    except HTTPException as e:
        print(f"SUCCESS: Caught expected error: {e.detail}")

    # Test 2
    try:
        order_data = test_invalid_half_and_half_in_promo()
        validate_promotion(schemas.OrderCreate(**order_data))
        print("FAIL: Half-and-half was accepted in promo")
    except HTTPException as e:
        print(f"SUCCESS: Caught expected error: {e.detail}")
