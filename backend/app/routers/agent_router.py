import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sse_starlette.sse import EventSourceResponse
from app.core.auth_dependency import get_current_user, UserAuthToken
from app.schemas.health import (
    HealthMetricsInput,
    CreateSessionRequest,
    SessionSchema,
    ChatMessageSchema,
    CoachStreamRequest
)
from app.schemas.daily_log import DailyHealthLogInput, DailyHealthLogSchema
from app.db.chat_repository import ChatRepository
from app.agents.wellness_agent import WellnessAgentEngine

logger = logging.getLogger("agent_router")
router = APIRouter(prefix="/api/v1", tags=["AI Wellness Coach"])
agent_engine = WellnessAgentEngine()

@router.get("/daily-logs", response_model=List[DailyHealthLogSchema])
async def get_user_daily_logs(
    current_user: UserAuthToken = Depends(get_current_user)
):
    """Fetches user's daily health history logs."""
    return await ChatRepository.get_daily_logs(current_user.uid)

@router.post("/daily-logs", response_model=DailyHealthLogSchema)
async def create_user_daily_log(
    body: DailyHealthLogInput,
    current_user: UserAuthToken = Depends(get_current_user)
):
    """Saves a new daily health log entry."""
    return await ChatRepository.save_daily_log(current_user.uid, body.model_dump())

@router.get("/sessions", response_model=List[SessionSchema])
async def list_user_sessions(
    current_user: UserAuthToken = Depends(get_current_user)
):
    """Fetches all past chat sessions belonging to the authenticated user."""
    return await ChatRepository.get_user_sessions(current_user.uid)

@router.post("/sessions", response_model=SessionSchema)
async def create_new_session(
    body: CreateSessionRequest,
    current_user: UserAuthToken = Depends(get_current_user)
):
    """Creates a new consultation chat session for the authenticated user."""
    title = body.title or "New Wellness Consultation"
    return await ChatRepository.create_session(current_user.uid, title)

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageSchema])
async def get_session_messages(
    session_id: str,
    current_user: UserAuthToken = Depends(get_current_user)
):
    """Fetches full message history for a specific session belonging to the user."""
    return await ChatRepository.get_session_messages(current_user.uid, session_id)

@router.get("/coach/stream")
@router.post("/coach/stream")
async def stream_coach_response(
    request: Optional[CoachStreamRequest] = None,
    user_prompt: Optional[str] = Query(None),
    session_id: Optional[str] = Query(None),
    current_user: UserAuthToken = Depends(get_current_user)
):
    """
    Real-time Server-Sent Events (SSE) streaming endpoint.
    Supports both POST (JSON body) and GET (query params).
    Guarded by Firebase Auth token verification.
    """
    prompt_text = (request.prompt if request else None) or user_prompt or "Hello coach!"
    sid = (request.session_id if request else None) or session_id
    metrics_obj = request.metrics if request else None

    if not sid:
        new_session = await ChatRepository.create_session(current_user.uid, f"Chat about: {prompt_text[:25]}...")
        sid = new_session["session_id"]

    async def event_generator():
        async for chunk in agent_engine.stream_coaching_session(
            user_id=current_user.uid,
            session_id=sid,
            user_prompt=prompt_text,
            metrics=metrics_obj
        ):
            yield {"event": "message", "data": chunk}

    return EventSourceResponse(event_generator())
