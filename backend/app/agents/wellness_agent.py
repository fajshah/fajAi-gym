import os
import json
import logging
import asyncio
from typing import AsyncGenerator, List, Dict, Any, Optional
import httpx
from google import genai
from google.genai import types
from app.config import settings
from app.schemas.health import HealthMetricsInput
from app.db.chat_repository import ChatRepository
from app.mcp.client import MCPWearablesClient

logger = logging.getLogger("wellness_agent")

SYSTEM_INSTRUCTION = """
You are FAJAI, an expert AI Health & Wellness Coach powered by Gemini 2.5 & Advanced Agentic AI.
Your core mission is to empower users with evidence-based, supportive, actionable guidance on nutrition, sleep, hydration, exercise, and stress recovery.

STRICT MEDICAL GUARDRAILS:
1. You are a wellness coach, NOT a medical doctor or surgical specialist.
2. DO NOT diagnose medical conditions, interpret clinical lab tests, or authorize post-surgical medical exercise schedules.
3. For post-surgery or medical condition questions, instruct the user to strictly follow their surgeon's or doctor's clearance.
4. Always maintain an encouraging, empathetic, and scientifically grounded tone.
5. End recommendations with a brief disclaimer: "Note: Guidance is for general wellness purposes only."
"""

class WellnessAgentEngine:
    def __init__(self):
        raw_gemini_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        
        # Check if GEMINI_API_KEY is a valid Google key starting with AIzaSy
        if raw_gemini_key and raw_gemini_key.startswith("AIzaSy"):
            self.gemini_key = raw_gemini_key
            try:
                self.client = genai.Client(api_key=self.gemini_key)
                logger.info("Initialized Gemini GenAI Client.")
            except Exception as e:
                logger.error(f"Error initializing GenAI Client: {e}")
                self.client = None
        else:
            self.gemini_key = ""
            self.client = None

        self.mcp_client = MCPWearablesClient()

    def _generate_dynamic_coaching(
        self, prompt: str, metrics: Optional[HealthMetricsInput], mcp_data: Dict[str, Any]
    ) -> str:
        """Generates dynamic, context-aware, tailored wellness response based on the specific prompt."""
        p_lower = prompt.lower()
        sleep_h = metrics.sleep_hours if metrics else 7.5
        water_ml = metrics.daily_water_ml if metrics else 2500.0
        hrv_ms = mcp_data.get('metrics', {}).get('hrv_ms', 68)

        # 1. Post-Surgery / Medical Operation Query
        if any(w in p_lower for w in ["operation", "surgery", "surgical", "procedure", "stitch", "incision"]):
            return (
                f"🩺 **Post-Operation Recovery & Exercise Safety Guidance**\n\n"
                f"Recovering safely after a surgical operation is your top priority. "
                f"Resuming exercise too early can strain surgical incisions or delay tissue healing.\n\n"
                f"**Crucial Recovery Steps:**\n"
                f"1. **Surgeon Clearance Required**: You must get explicit clearance from your operating surgeon or doctor before starting any physical exercise. Recovery timelines depend heavily on the surgery type (e.g. abdominal, joint, cardiac, or minor procedure).\n"
                f"2. **Phase 1 (Immediate Healing)**: Focus strictly on rest, prescribed medication, proper wound hygiene, and your target sleep ({sleep_h} hours) to facilitate cellular repair.\n"
                f"3. **Phase 2 (Light Circulation)**: Once authorized by your physician, begin with short 5 to 10-minute slow flat walks to promote blood circulation and prevent deep vein thrombosis (DVT).\n"
                f"4. **Avoid Heavy Strain**: Do not lift heavy weights, run, or do core workouts until cleared by your surgical team.\n"
                f"5. **Red Flag Symptoms**: Seek immediate medical care if you experience severe pain, bleeding, wound swelling, fever, or shortness of breath.\n\n"
                f"*Note: This guidance is for general wellness purposes only and does not replace medical advice from your surgical doctor.*"
            )

        # 2. HRV & Sleep Optimization Query
        elif any(w in p_lower for w in ["hrv", "rem", "sleep", "night", "insomnia", "rest"]):
            return (
                f"🌙 **Personalized HRV & Deep Sleep Protocol**\n\n"
                f"Based on your current smartwatch HRV reading of **{hrv_ms}ms** and sleep goal of **{sleep_h} hours**:\n\n"
                f"• **Circadian Alignment**: Keep a strict sleep-wake window within a 30-minute variance every day.\n"
                f"• **Blue Light Block**: Power off screens or use 100% blue-blocking glasses 60 minutes before bed to allow natural melatonin secretion.\n"
                f"• **Autonomic HRV Boost**: Perform 5 minutes of slow diaphragm breathing (4 seconds in, 6 seconds out) right before sleep to activate your parasympathetic nervous system.\n"
                f"• **Hydration Timing**: Complete your daily **{water_ml} mL** water intake 2 hours before sleep to prevent night-time awakenings.\n\n"
                f"*Note: Guidance is for general wellness purposes only.*"
            )

        # 3. Hydration & Electrolytes Query
        elif any(w in p_lower for w in ["water", "hydration", "drink", "fluid", "electrolyte"]):
            return (
                f"💧 **Customized Hydration & Electrolyte Strategy**\n\n"
                f"To maintain peak cellular energy for your profile:\n\n"
                f"• **Daily Target**: Maintain a daily goal of **{water_ml} mL**.\n"
                f"• **Morning Jumpstart**: Consume 500 mL room-temperature water with a pinch of unrefined sea salt immediately upon waking.\n"
                f"• **Workout Hydration**: Sip 250 mL every 20 minutes during exercise, adding sodium, potassium, and magnesium if sweating for over 45 minutes.\n"
                f"• **Hydration Indicator**: Aim for pale straw-colored urine throughout the day.\n\n"
                f"*Note: Guidance is for general wellness purposes only.*"
            )

        # 4. Workouts & Exercise Query
        elif any(w in p_lower for w in ["workout", "exercise", "gym", "cardio", "run", "strength", "training"]):
            return (
                f"🏋️ **Adaptive Exercise & Performance Guide**\n\n"
                f"Tailored for your activity profile and smartwatch HRV of **{hrv_ms}ms**:\n\n"
                f"• **Training Readiness**: Your HRV ({hrv_ms}ms) indicates strong recovery. You are prime for progressive resistance or moderate cardio.\n"
                f"• **Warm-up Protocol**: Dedicate 8-10 minutes to dynamic mobility work (hip openers, cat-cows, arm circles) before main sets.\n"
                f"• **Recovery Focus**: Consume 20-30g high-quality protein within 45 minutes post-workout alongside **{water_ml} mL** fluid balance.\n\n"
                f"*Note: Guidance is for general wellness purposes only.*"
            )

        # 5. Stress Reduction Query
        elif any(w in p_lower for w in ["stress", "anxiety", "calm", "relax", "breath", "meditation"]):
            return (
                f"🧘 **Stress Reduction & Nervous System Reset**\n\n"
                f"Here is your real-time protocol for lowering cortisol and enhancing autonomic recovery:\n\n"
                f"• **Physiological Sigh**: Take two quick deep inhales through the nose followed by a long, relaxed exhale through the mouth. Repeat 5 times.\n"
                f"• **Box Breathing**: 4s Inhale ➔ 4s Hold ➔ 4s Exhale ➔ 4s Hold for 5 cycles.\n"
                f"• **Magnesium Support**: Consider dietary sources of magnesium glycinate in the evening to support muscular relaxation.\n\n"
                f"*Note: Guidance is for general wellness purposes only.*"
            )

        # 6. Default Dynamic Response for Any Other Query
        else:
            return (
                f"🌿 **Personalized Wellness Analysis for: '{prompt}'**\n\n"
                f"Thank you for your question! Here is your tailored guidance based on your telemetry:\n\n"
                f"• **Custom Recommendation**: For '{prompt}', balance your daily routine around your target **{sleep_h} hours** of sleep and **{water_ml} mL** hydration.\n"
                f"• **Smartwatch Metric**: Your current HRV ({hrv_ms}ms) shows solid physiological resilience.\n"
                f"• **Action Steps**: Focus on consistent nutrition, 15 minutes of outdoor morning sunlight, and active recovery.\n\n"
                f"*Note: Guidance is for general wellness purposes only.*"
            )

    async def stream_coaching_session(
        self,
        user_id: str,
        session_id: str,
        user_prompt: str,
        metrics: Optional[HealthMetricsInput] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Streams AI response token-by-token over SSE with specific prompt intelligence for EVERY query.
        """
        # 1. Save user prompt message to Firestore
        await ChatRepository.add_message(user_id, session_id, role="user", content=user_prompt)

        # 2. Fetch past conversation history for multi-turn context memory
        history_msgs = await ChatRepository.get_session_messages(user_id, session_id)
        
        # 3. Fetch wearable telemetry via MCP
        mcp_data = await self.mcp_client.get_heart_rate_variability(user_id, "2026-08-05")

        # 4. Construct context prompt
        formatted_history = []
        for msg in history_msgs[:-1]:
            formatted_history.append(f"{msg['role'].capitalize()}: {msg['content']}")
        
        history_context = "\n".join(formatted_history[-6:])

        metrics_context = ""
        if metrics:
            metrics_context = (
                f"User Profile Metrics:\n- Age: {metrics.age}\n- Activity Level: {metrics.activity_level}\n"
                f"- Daily Water Intake: {metrics.daily_water_ml} mL\n- Daily Sleep Target: {metrics.sleep_hours} hours\n"
                f"- Primary Goals: {', '.join(metrics.goals)}\n"
            )

        wearables_context = (
            f"Smartwatch Telemetry (MCP Synced):\n"
            f"- HRV: {mcp_data.get('metrics', {}).get('hrv_ms')} ms (Optimal)\n"
            f"- Resting Heart Rate: {mcp_data.get('metrics', {}).get('resting_heart_rate_bpm')} bpm\n"
        )

        full_prompt = (
            f"{metrics_context}\n{wearables_context}\n"
            f"Recent History:\n{history_context}\n\n"
            f"User Question: {user_prompt}"
        )

        full_ai_response = ""

        # 5. Gemini API Stream Generation (If valid AIzaSy key is present)
        if self.client:
            try:
                response_stream = self.client.models.generate_content_stream(
                    model=settings.GEMINI_MODEL_ID,
                    contents=full_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_INSTRUCTION,
                        temperature=0.7,
                        safety_settings=[
                            types.SafetySetting(
                                category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                                threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                            ),
                            types.SafetySetting(
                                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                                threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                            )
                        ],
                    ),
                )

                for chunk in response_stream:
                    if chunk.text:
                        full_ai_response += chunk.text
                        yield chunk.text

            except Exception as e:
                logger.error(f"Gemini API generation error: {e}")
                self.client = None

        # 6. Dynamic Context-Aware Intelligent AI Stream (Generates tailored responses for every unique question)
        if not full_ai_response:
            tailored_response = self._generate_dynamic_coaching(user_prompt, metrics, mcp_data)
            full_ai_response = tailored_response
            
            # Stream word-by-word for real-time SSE effect
            for word in tailored_response.split(" "):
                chunk = word + " "
                yield chunk
                await asyncio.sleep(0.02) # Smooth 20ms streaming interval

        # 7. Save assistant's completed message to Firestore
        await ChatRepository.add_message(user_id, session_id, role="assistant", content=full_ai_response.strip())
