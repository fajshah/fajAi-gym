import json
import logging
from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp_health_wearables")

app = FastAPI(
    title="Health & Wearables MCP Server",
    description="Model Context Protocol (MCP) tool provider for smartwatch & health sensor telemetry.",
    version="1.0.0"
)

# -----------------------------------------------------------------------------
# Tool Parameter Schemas
# -----------------------------------------------------------------------------
class HRVQuery(BaseModel):
    user_id: str = Field(..., description="The unique user ID")
    date: str = Field(..., description="Query date in YYYY-MM-DD format")

class SleepQuery(BaseModel):
    user_id: str = Field(..., description="The unique user ID")
    date: str = Field(..., description="Query date in YYYY-MM-DD format")

class ActivityQuery(BaseModel):
    user_id: str = Field(..., description="The unique user ID")
    date: str = Field(..., description="Query date in YYYY-MM-DD format")

class GlucoseQuery(BaseModel):
    user_id: str = Field(..., description="The unique user ID")
    date: str = Field(..., description="Query date in YYYY-MM-DD format")

# -----------------------------------------------------------------------------
# Mock Wearables Data Generators (Representing Apple Health, Fitbit, Garmin, Dexcom)
# -----------------------------------------------------------------------------
@app.post("/tools/get_heart_rate_variability")
async def get_heart_rate_variability(query: HRVQuery) -> Dict[str, Any]:
    """Fetches Resting Heart Rate (RHR) and Heart Rate Variability (HRV) metrics."""
    logger.info(f"Fetching HRV data for user {query.user_id} on {query.date}")
    return {
        "status": "success",
        "device": "Apple Watch Series 9",
        "date": query.date,
        "metrics": {
            "hrv_ms": 68,
            "resting_heart_rate_bpm": 54,
            "hrv_status": "OPTIMAL",
            "recovery_score": 85
        }
    }

@app.post("/tools/get_sleep_architecture")
async def get_sleep_architecture(query: SleepQuery) -> Dict[str, Any]:
    """Fetches detailed sleep stage breakdown (Deep, REM, Light, Awake)."""
    logger.info(f"Fetching Sleep data for user {query.user_id} on {query.date}")
    return {
        "status": "success",
        "device": "Oura Ring Gen3",
        "date": query.date,
        "metrics": {
            "total_sleep_hours": 7.6,
            "deep_sleep_minutes": 105,
            "rem_sleep_minutes": 92,
            "light_sleep_minutes": 220,
            "awake_minutes": 39,
            "sleep_efficiency_pct": 89
        }
    }

@app.post("/tools/get_activity_summary")
async def get_activity_summary(query: ActivityQuery) -> Dict[str, Any]:
    """Fetches daily activity telemetry: step count, active calories, and exercise minutes."""
    logger.info(f"Fetching Activity data for user {query.user_id} on {query.date}")
    return {
        "status": "success",
        "device": "Garmin Forerunner 965",
        "date": query.date,
        "metrics": {
            "steps": 10450,
            "active_calories_kcal": 580,
            "exercise_minutes": 45,
            "floors_climbed": 12,
            "vo2_max": 48
        }
    }

@app.post("/tools/get_continuous_glucose")
async def get_continuous_glucose(query: GlucoseQuery) -> Dict[str, Any]:
    """Fetches continuous glucose monitor (CGM) sensor telemetry."""
    logger.info(f"Fetching CGM data for user {query.user_id} on {query.date}")
    return {
        "status": "success",
        "device": "Dexcom G7 CGM",
        "date": query.date,
        "metrics": {
            "average_glucose_mg_dl": 98,
            "time_in_range_pct": 94,
            "variability_coefficient_pct": 14,
            "glucose_trend": "STABLE"
        }
    }

@app.get("/tools")
async def list_tools() -> Dict[str, Any]:
    """Returns directory of available MCP health wearable tools."""
    return {
        "tools": [
            {
                "name": "get_heart_rate_variability",
                "description": "Fetch resting heart rate and HRV recovery data from smartwatch.",
                "endpoint": "/tools/get_heart_rate_variability"
            },
            {
                "name": "get_sleep_architecture",
                "description": "Fetch sleep stages (Deep, REM, Light) and sleep efficiency.",
                "endpoint": "/tools/get_sleep_architecture"
            },
            {
                "name": "get_activity_summary",
                "description": "Fetch step count, active calories, and exercise duration.",
                "endpoint": "/tools/get_activity_summary"
            },
            {
                "name": "get_continuous_glucose",
                "description": "Fetch continuous glucose monitor (CGM) readings and time-in-range.",
                "endpoint": "/tools/get_continuous_glucose"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
