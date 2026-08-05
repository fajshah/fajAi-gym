from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class DailyHealthLogInput(BaseModel):
    date: str = Field(..., description="Date in YYYY-MM-DD format", example="2026-08-05")
    energy_score: int = Field(8, ge=1, le=10, example=8)
    sleep_hours: float = Field(7.5, ge=0, le=24, example=7.5)
    water_ml: float = Field(2500, ge=0, example=2500)
    hrv_ms: int = Field(68, ge=0, example=68)
    notes: Optional[str] = Field("", example="Felt energized after morning walk and 8 hours sleep.")
    workout_done: bool = Field(True)

class DailyHealthLogSchema(DailyHealthLogInput):
    user_id: str
    created_at: int
    ai_summary: Optional[str] = None
