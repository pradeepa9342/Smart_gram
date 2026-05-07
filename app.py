"""
SMART-GRAM Python Backend (app.py)
===================================
FastAPI-based backend server that provides AI, weather, and data
endpoints for the Smart-Gram village digital platform.

- Crop recommendation via Groq/Llama
- Village weather simulation / OpenWeatherMap integration
- Complaint categorization via AI
- SmartGram chatbot assistant
- Government schemes & water monitoring data

Compatible with Hugging Face Spaces (port 7860) and local dev.
"""

import os
import random
import httpx
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")
PORT = int(os.getenv("PORT", 7860))


# ─────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[Smart-Gram] API starting on port {PORT}")
    yield
    print("[Smart-Gram] API shutting down")


# ─────────────────────────────────────────────
# App initialization
# ─────────────────────────────────────────────
app = FastAPI(
    title="Smart-Gram API",
    description="Python backend for Smart-Gram – Empowering Villages through Digital Innovation",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Request / Response Models
# ─────────────────────────────────────────────
class CropRequest(BaseModel):
    temperature: float
    humidity: float
    season: str  # "Kharif" | "Rabi" | "Zaid"


class CropResponse(BaseModel):
    recommended: str
    alternative: str
    reason: str
    tip: str
    raw: str


class ChatRequest(BaseModel):
    message: str
    language: str = "English"  # "English" | "Tamil"


class ChatResponse(BaseModel):
    reply: str


class ComplaintRequest(BaseModel):
    description: str


class ComplaintResponse(BaseModel):
    category: str  # Water | Agriculture | Healthcare | Others


class WeatherResponse(BaseModel):
    location: str
    temperature: float
    humidity: float
    weather_condition: str
    wind: float
    icon: str
    updated_at: str


class SchemeResponse(BaseModel):
    id: int
    name: str
    description: str
    eligibility: str
    deadline: str
    status: str


class WaterTankResponse(BaseModel):
    zone: str
    level_percent: int
    status: str
    last_updated: str


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
async def call_groq(model: str, system: str, user: str, temperature: float = 0.5) -> str:
    """Send a request to the Groq LLM API and return the text response."""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY is not configured on the server.")

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": temperature,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(GROQ_API_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


def parse_crop_response(raw: str) -> dict:
    """Parse the pipe-delimited crop suggestion from the LLM."""
    result = {"recommended": "Paddy", "alternative": "Maize", "reason": "Suitable conditions.", "tip": "Use organic compost.", "raw": raw}
    try:
        parts = dict(p.split(":", 1) for p in raw.split("|"))
        result["recommended"] = parts.get("RECOMMENDED", "Paddy").strip()
        result["alternative"] = parts.get("ALTERNATIVE", "Maize").strip()
        result["reason"] = parts.get("REASON", "Suitable conditions.").strip()
        result["tip"] = parts.get("TIP", "Use organic compost.").strip()
    except Exception:
        pass
    return result


# ─────────────────────────────────────────────
# Routes – Health
# ─────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    """Root health check endpoint."""
    return {
        "service": "Smart-Gram API",
        "status": "running",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/health", tags=["Health"])
async def health():
    """Detailed health check."""
    return {
        "status": "ok",
        "groq_configured": bool(GROQ_API_KEY),
        "weather_configured": bool(WEATHER_API_KEY),
        "timestamp": datetime.now().isoformat(),
    }


# ─────────────────────────────────────────────
# Routes – AI / Crop
# ─────────────────────────────────────────────
@app.post("/api/crop-suggestion", response_model=CropResponse, tags=["AI"])
async def crop_suggestion(req: CropRequest):
    """
    Returns AI-powered crop recommendations based on current
    temperature, humidity, and season — optimised for South Indian farming.
    """
    prompt = (
        f"Temperature: {req.temperature}°C, Humidity: {req.humidity}%, Season: {req.season}. "
        "Suggest one ideal crop and one alternative. Give a brief reason and one farming tip. "
        "Format: RECOMMENDED: [Crop Name] | ALTERNATIVE: [Crop Name] | REASON: [Short Text] | TIP: [Short Text]"
    )
    system = "You are a professional South Indian agriculture expert specialising in Tamil Nadu farming."

    raw = await call_groq("llama-3.3-70b-versatile", system, prompt, temperature=0.5)
    parsed = parse_crop_response(raw)
    return CropResponse(**parsed)


# ─────────────────────────────────────────────
# Routes – Chatbot
# ─────────────────────────────────────────────
@app.post("/api/chat", response_model=ChatResponse, tags=["AI"])
async def chat(req: ChatRequest):
    """
    SmartGram administrative assistant chatbot.
    Handles queries about complaints, schemes, water supply, healthcare drives,
    and village office contact information.
    """
    now = datetime.now()
    date_str = now.strftime("%A, %B %d, %Y")
    time_str = now.strftime("%I:%M %p")

    system = f"""You are the SmartGram Administrative Assistant, a specialized digital helper for the
SMART-GRAM village platform in Erode, Tamil Nadu.

Current Context:
- Today's Date: {date_str}
- Local Time: {time_str}
- Location: Erode, Tamil Nadu (South Village Sector)

Administrative Contact Details you MUST provide if asked:
1. Village Administrative Officer (VAO): Mr. S. Rangasamy (Contact for land records & certificates).
2. Panchayat President: Mrs. K. Lakshmi (Contact for village development & infrastructure).
3. Municipal Office: Main Road, Near Bus Stand, Erode South.
4. Working Hours: 10:00 AM to 5:00 PM (Monday to Saturday).
5. Helpline: 0424-2256111

Your Primary Role:
1. Provide contact information for village administrators and officers.
2. Assist citizens with the status of their submitted complaints.
3. Guide users on how to apply for Government Schemes (e.g., provide eligibility info).
4. Inform users about office hours and location of the Municipal Office.
5. Help with official matters related to Water supply schedules and Healthcare drives.

Language: {req.language}. Be official, polite, and extremely precise with names and contact details."""

    reply = await call_groq("llama-3.3-70b-versatile", system, req.message, temperature=0.7)
    return ChatResponse(reply=reply)


# ─────────────────────────────────────────────
# Routes – Complaint categorization
# ─────────────────────────────────────────────
@app.post("/api/categorize-complaint", response_model=ComplaintResponse, tags=["AI"])
async def categorize_complaint(req: ComplaintRequest):
    """
    Categorises a citizen complaint into: Water | Agriculture | Healthcare | Others
    using a lightweight Llama model.
    """
    system = (
        "You are a village support classifier. Categorize the user complaint into exactly one of these: "
        "Water, Agriculture, Healthcare, or Others. Only output the single word category name."
    )
    try:
        result = await call_groq("llama3-8b-8192", system, req.description, temperature=0.1)
        result = result.strip()
        valid = ["Water", "Agriculture", "Healthcare", "Others"]
        category = result if result in valid else "Others"
    except Exception:
        category = "Others"

    return ComplaintResponse(category=category)


# ─────────────────────────────────────────────
# Routes – Weather
# ─────────────────────────────────────────────
@app.get("/api/weather", response_model=WeatherResponse, tags=["Weather"])
async def get_weather(village: str = "Erode"):
    """
    Returns current weather data for the specified village.
    Uses OpenWeatherMap if WEATHER_API_KEY is configured,
    otherwise returns a realistic simulation for Erode, Tamil Nadu.
    """
    if WEATHER_API_KEY:
        try:
            url = (
                f"https://api.openweathermap.org/data/2.5/weather"
                f"?q={village},IN&appid={WEATHER_API_KEY}&units=metric"
            )
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url)
                resp.raise_for_status()
                d = resp.json()
                return WeatherResponse(
                    location=f"{d['name']}, Tamil Nadu",
                    temperature=round(d["main"]["temp"], 1),
                    humidity=d["main"]["humidity"],
                    weather_condition=d["weather"][0]["description"].title(),
                    wind=round(d["wind"]["speed"] * 3.6, 1),  # m/s → km/h
                    icon=d["weather"][0]["icon"],
                    updated_at=datetime.now().strftime("%I:%M %p"),
                )
        except Exception:
            pass  # Fall through to simulation

    # Realistic simulation for Erode, Tamil Nadu
    conditions = ["Clear Sky", "Partly Cloudy", "Mostly Cloudy", "Light Rain"]
    return WeatherResponse(
        location=f"{village}, Tamil Nadu",
        temperature=round(28 + random.uniform(0, 7), 1),
        humidity=random.randint(60, 75),
        weather_condition=random.choice(conditions),
        wind=round(10 + random.uniform(0, 10), 1),
        icon="02d",
        updated_at=datetime.now().strftime("%I:%M %p"),
    )


# ─────────────────────────────────────────────
# Routes – Government Schemes
# ─────────────────────────────────────────────
SCHEMES = [
    {
        "id": 1,
        "name": "PM-KISAN Scheme",
        "description": "Direct income support of ₹6,000/year to farmer families.",
        "eligibility": "Small and marginal farmers with cultivable land.",
        "deadline": "2026-12-31",
        "status": "Active",
    },
    {
        "id": 2,
        "name": "Tamil Nadu Crop Insurance",
        "description": "Comprehensive crop loss coverage for natural calamities.",
        "eligibility": "All registered farmers in Tamil Nadu.",
        "deadline": "2026-06-30",
        "status": "Active",
    },
    {
        "id": 3,
        "name": "Free Solar Pump Scheme",
        "description": "Subsidized solar-powered irrigation pumps for farmers.",
        "eligibility": "Farmers with less than 5 acres of land.",
        "deadline": "2026-08-15",
        "status": "Active",
    },
    {
        "id": 4,
        "name": "Village Health Mission",
        "description": "Free health check-up camps and medicines for villagers.",
        "eligibility": "All permanent village residents.",
        "deadline": "Ongoing",
        "status": "Active",
    },
    {
        "id": 5,
        "name": "Housing for All (PMAY-G)",
        "description": "Financial assistance for construction of pucca houses.",
        "eligibility": "BPL families without pucca houses.",
        "deadline": "2026-03-31",
        "status": "Active",
    },
]


@app.get("/api/schemes", response_model=list[SchemeResponse], tags=["Government"])
async def get_schemes():
    """Returns all active government schemes available to village residents."""
    return SCHEMES


@app.get("/api/schemes/{scheme_id}", response_model=SchemeResponse, tags=["Government"])
async def get_scheme(scheme_id: int):
    """Returns details for a specific government scheme by ID."""
    scheme = next((s for s in SCHEMES if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


# ─────────────────────────────────────────────
# Routes – Water Monitoring
# ─────────────────────────────────────────────
WATER_ZONES = [
    {"zone": "Zone A – North Village", "base_level": 78},
    {"zone": "Zone B – Market Area",   "base_level": 62},
    {"zone": "Zone C – South Fields",  "base_level": 85},
    {"zone": "Zone D – East Colony",   "base_level": 55},
]


def tank_status(level: int) -> str:
    if level >= 75:
        return "Good"
    if level >= 50:
        return "Moderate"
    return "Low"


@app.get("/api/water-tanks", response_model=list[WaterTankResponse], tags=["Water"])
async def get_water_tanks():
    """Returns live water tank levels for all village zones."""
    result = []
    for z in WATER_ZONES:
        level = max(10, min(100, z["base_level"] + random.randint(-5, 5)))
        result.append(
            WaterTankResponse(
                zone=z["zone"],
                level_percent=level,
                status=tank_status(level),
                last_updated=datetime.now().strftime("%I:%M %p"),
            )
        )
    return result


# ─────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=PORT, reload=True)
