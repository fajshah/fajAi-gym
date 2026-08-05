import time
import uuid
import logging
from typing import List, Dict, Any, Optional
from google.cloud import firestore
from app.core.firebase import get_firestore_db

logger = logging.getLogger("chat_repository")

# In-memory storage fallback for dev/offline testing
_in_memory_sessions: Dict[str, Dict[str, Any]] = {}
_in_memory_messages: Dict[str, List[Dict[str, Any]]] = {}

class ChatRepository:
    """Manages chat session history and message storage in Firestore (with dev fallback)."""

    @staticmethod
    async def create_session(user_id: str, title: str = "New Wellness Consultation") -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        now = int(time.time())
        session_data = {
            "session_id": session_id,
            "user_id": user_id,
            "title": title,
            "created_at": now,
            "updated_at": now
        }

        db = get_firestore_db()
        if db:
            try:
                db.collection("users").document(user_id).collection("sessions").document(session_id).set(session_data)
                logger.info(f"Created Firestore session {session_id} for user {user_id}")
            except Exception as e:
                logger.error(f"Firestore session creation error: {e}")
        
        # Always maintain local dev fallback
        _in_memory_sessions[session_id] = session_data
        _in_memory_messages[session_id] = []
        return session_data

    @staticmethod
    async def get_user_sessions(user_id: str) -> List[Dict[str, Any]]:
        db = get_firestore_db()
        if db:
            try:
                docs = (
                    db.collection("users")
                    .document(user_id)
                    .collection("sessions")
                    .order_by("updated_at", direction=firestore.Query.DESCENDING)
                    .stream()
                )
                sessions = [doc.to_dict() for doc in docs]
                if sessions:
                    return sessions
            except Exception as e:
                logger.error(f"Firestore fetch sessions error: {e}")

        # Fallback in-memory filter
        return [
            s for s in _in_memory_sessions.values() if s.get("user_id") == user_id
        ]

    @staticmethod
    async def get_session_messages(user_id: str, session_id: str) -> List[Dict[str, Any]]:
        db = get_firestore_db()
        if db:
            try:
                docs = (
                    db.collection("users")
                    .document(user_id)
                    .collection("sessions")
                    .document(session_id)
                    .collection("messages")
                    .order_by("timestamp", direction=firestore.Query.ASCENDING)
                    .stream()
                )
                messages = [doc.to_dict() for doc in docs]
                if messages:
                    return messages
            except Exception as e:
                logger.error(f"Firestore fetch messages error: {e}")

        return _in_memory_messages.get(session_id, [])

    @staticmethod
    async def add_message(user_id: str, session_id: str, role: str, content: str) -> Dict[str, Any]:
        message_id = str(uuid.uuid4())
        now = int(time.time())
        msg_data = {
            "message_id": message_id,
            "session_id": session_id,
            "user_id": user_id,
            "role": role,  # 'user' or 'assistant'
            "content": content,
            "timestamp": now
        }

        db = get_firestore_db()
        if db:
            try:
                session_ref = db.collection("users").document(user_id).collection("sessions").document(session_id)
                msg_ref = session_ref.collection("messages").document(message_id)
                
                batch = db.batch()
                batch.set(msg_ref, msg_data)
                batch.update(session_ref, {"updated_at": now})
                batch.commit()
                logger.info(f"Added message {message_id} to Firestore session {session_id}")
            except Exception as e:
                logger.error(f"Firestore add_message error: {e}")

        if session_id not in _in_memory_messages:
            _in_memory_messages[session_id] = []
        _in_memory_messages[session_id].append(msg_data)

        if session_id in _in_memory_sessions:
            _in_memory_sessions[session_id]["updated_at"] = now

        return msg_data

    @staticmethod
    async def save_daily_log(user_id: str, log_data: Dict[str, Any]) -> Dict[str, Any]:
        date = log_data["date"]
        now = int(time.time())
        record = {**log_data, "user_id": user_id, "created_at": now}

        db = get_firestore_db()
        if db:
            try:
                db.collection("users").document(user_id).collection("daily_logs").document(date).set(record)
                logger.info(f"Saved daily log for date {date}")
            except Exception as e:
                logger.error(f"Firestore save_daily_log error: {e}")

        # Fallback storage
        if "daily_logs" not in _in_memory_sessions:
            _in_memory_sessions["daily_logs"] = {}
        _in_memory_sessions["daily_logs"][f"{user_id}_{date}"] = record
        return record

    @staticmethod
    async def get_daily_logs(user_id: str) -> List[Dict[str, Any]]:
        db = get_firestore_db()
        if db:
            try:
                docs = (
                    db.collection("users")
                    .document(user_id)
                    .collection("daily_logs")
                    .order_by("date", direction=firestore.Query.DESCENDING)
                    .stream()
                )
                logs = [doc.to_dict() for doc in docs]
                if logs:
                    return logs
            except Exception as e:
                logger.error(f"Firestore get_daily_logs error: {e}")

        # Fallback filter
        all_logs = _in_memory_sessions.get("daily_logs", {})
        user_logs = [v for k, v in all_logs.items() if k.startswith(f"{user_id}_")]
        return sorted(user_logs, key=lambda x: x["date"], reverse=True)

