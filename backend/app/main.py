from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import alerts, analytics, attacks, departments, incidents, systems, users

app = FastAPI(title="CyberTrace", version="0.1.0", description="Security Incident Logging & Analysis System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(departments.router)
app.include_router(attacks.router)
app.include_router(users.router)
app.include_router(systems.router)
app.include_router(incidents.router)
app.include_router(analytics.router)
app.include_router(alerts.router)


@app.get("/health")
def health():
    return {"status": "ok"}
