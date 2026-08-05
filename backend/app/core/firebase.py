import logging
import firebase_admin
from firebase_admin import credentials, auth, firestore
from app.config import settings

logger = logging.getLogger("firebase_core")

_firebase_app = None
_db_client = None

def init_firebase():
    """Initializes Firebase Admin SDK instance once."""
    global _firebase_app, _db_client
    if _firebase_app is not None:
        return _firebase_app

    try:
        if settings.FIREBASE_PROJECT_ID and settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
            private_key = settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n')
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "private_key": private_key,
            })
            _firebase_app = firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized with Service Account.")
        else:
            # Fallback to default application credentials or dev mock
            try:
                _firebase_app = firebase_admin.initialize_app()
                logger.info("Firebase Admin SDK initialized with Default Credentials.")
            except Exception:
                logger.warning("Firebase credentials not configured. Auth & Firestore will run in Mock Mode.")
                _firebase_app = None

        if _firebase_app:
            _db_client = firestore.client()

    except Exception as e:
        logger.error(f"Error initializing Firebase Admin SDK: {e}")
        _firebase_app = None
        _db_client = None

    return _firebase_app

def get_firestore_db():
    """Returns Firestore client instance."""
    global _db_client
    if _db_client is None:
        init_firebase()
    return _db_client
