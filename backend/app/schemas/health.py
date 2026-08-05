from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class HealthMetricsInput(BaseModel):
    age: int = Field(..., ge=1, le=120, example=28)
    activity_level: str = Field("moderate", example="moderate") # sedentary, light, moderate, active, intense
    daily_water_ml: float = Field(2500, ge=0, example=2500)
    sleep_hours: float = Field(7.5, ge=0, le=24, example=7.5)
    goals: List[str] = Field(default_factory=lambda: ["weight_management", "stress_reduction"])

class CreateSessionRequest(BaseModel):
    title: Optional[str] = Field("New Consultation", example="Morning Wellness Check-in")

class ChatMessageSchema(BaseModel):
    message_id: str
    session_id: str
    user_id: str
    role: str # 'user' or 'assistant'
    content: str
    timestamp: int

class SessionSchema(BaseModel):
    session_id: str
    user_id: str
    title: str
    created_at: int
    updated_at: int

class CoachStreamRequest(BaseModel):
    prompt: str = Field(..., example="How can I improve my REM sleep and HRV recovery?")
    session_id: Optional[str] = None
    metrics: Optional[HealthMetricsInput] = None
