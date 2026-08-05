import logging
from typing import Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger("mcp_client")

class MCPWearablesClient:
    """Client bridge for invoking MCP Wearables tools."""

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = (base_url or settings.MCP_WEARABLES_SERVER_URL).rstrip("/")

    async def get_heart_rate_variability(self, user_id: str, date: str) -> Dict[str, Any]:
        """Calls MCP tool endpoint for HRV data."""
        url = f"{self.base_url}/tools/get_heart_rate_variability"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, json={"user_id": user_id, "date": date})
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"Failed to fetch HRV via MCP tool: {e}")
        # Mock fallback data if MCP server is offline
        return {
            "status": "mock",
            "date": date,
            "metrics": {"hrv_ms": 65, "resting_heart_rate_bpm": 56, "recovery_score": 82}
        }

    async def get_sleep_architecture(self, user_id: str, date: str) -> Dict[str, Any]:
        """Calls MCP tool endpoint for Sleep Stage data."""
        url = f"{self.base_url}/tools/get_sleep_architecture"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, json={"user_id": user_id, "date": date})
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"Failed to fetch Sleep telemetry via MCP tool: {e}")
        return {
            "status": "mock",
            "date": date,
            "metrics": {"total_sleep_hours": 7.5, "deep_sleep_minutes": 98, "rem_sleep_minutes": 90}
        }

    async def get_activity_summary(self, user_id: str, date: str) -> Dict[str, Any]:
        """Calls MCP tool endpoint for Activity data."""
        url = f"{self.base_url}/tools/get_activity_summary"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, json={"user_id": user_id, "date": date})
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"Failed to fetch Activity summary via MCP tool: {e}")
        return {
            "status": "mock",
            "date": date,
            "metrics": {"steps": 9800, "active_calories_kcal": 520, "exercise_minutes": 40}
        }

    async def get_continuous_glucose(self, user_id: str, date: str) -> Dict[str, Any]:
        """Calls MCP tool endpoint for CGM glucose data."""
        url = f"{self.base_url}/tools/get_continuous_glucose"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, json={"user_id": user_id, "date": date})
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"Failed to fetch CGM glucose via MCP tool: {e}")
        return {
            "status": "mock",
            "date": date,
            "metrics": {"average_glucose_mg_dl": 96, "time_in_range_pct": 95, "glucose_trend": "STABLE"}
        }
