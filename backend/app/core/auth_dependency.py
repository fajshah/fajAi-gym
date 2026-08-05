import logging
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from app.core.firebase import init_firebase

logger = logging.getLogger("auth_dependency")
security = HTTPBearer(auto_error=False)

class UserAuthToken:
    def __init__(self, uid: str, email: Optional[str] = None, name: Optional[str] = None, claims: Optional[Dict[str, Any]] = None):
        self.uid = uid
        self.email = email
        self.name = name
        self.claims = claims or {}

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> UserAuthToken:
    """
    FastAPI dependency guarding protected endpoints.
    Verifies the Firebase ID Token in the Authorization header.
    """
    if not credentials:
        # Development fallback if testing locally without auth token
        logger.warning("No Authorization header provided. Returning mock dev user.")
        return UserAuthToken(uid="dev_user_123", email="dev@wellness.ai", name="Dev Wellness User")

    token = credentials.credentials
    init_firebase()

    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        name = decoded_token.get("name") or decoded_token.get("email", "").split("@")[0]

        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token: missing UID."
            )

        return UserAuthToken(uid=uid, email=email, name=name, claims=decoded_token)

    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID Token has expired. Please sign in again."
        )
    except Exception as e:
        logger.error(f"Failed to verify Firebase ID token: {e}")
        # Allow dev fallback if token is 'mock_token'
        if token == "mock_token":
            return UserAuthToken(uid="dev_user_123", email="dev@wellness.ai", name="Dev Wellness User")
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase ID Token: {str(e)}"
        )
