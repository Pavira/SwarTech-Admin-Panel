from fastapi import APIRouter
from app.services.auth.signin_service import login_user_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Auth"])


@router.post("/signin/{pin}")
def login_user(pin: str):
    logger.info("🔐 Processing login request...")
    """
    API to login a user with email and password.
    """
    result = login_user_service(pin)
    return result
