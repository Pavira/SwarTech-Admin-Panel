# app/services/auth_service.py
from fastapi import HTTPException
from app.db.firebase_client import db


def login_user_service(pin: str):
    try:
        password_ref = db.collection("admin").document("credentials").get()
        if password_ref.exists:
            stored_pin = password_ref.to_dict().get("pin")
            if pin == stored_pin:
                return {"success": True, "message": "Login successful"}
            else:
                return {"success": False, "message": "Invalid PIN"}
        else:
            raise HTTPException(
                status_code=500, detail="Credentials not found in database"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
