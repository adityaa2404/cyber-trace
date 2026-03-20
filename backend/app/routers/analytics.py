from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.analytics import (
    AttackFrequency,
    HighRiskSystem,
    IncidentTrend,
    IncidentsByGroup,
    RepeatedAttack,
    ResponseTimeBySeverity,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/attack-frequency", response_model=list[AttackFrequency])
def attack_frequency(db: Session = Depends(get_db)):
    return AnalyticsService.attack_frequency(db)


@router.get("/incident-trends", response_model=list[IncidentTrend])
def incident_trends(granularity: str = Query(default="daily", pattern="^(daily|monthly)$"), db: Session = Depends(get_db)):
    return AnalyticsService.incident_trends(db, granularity)


@router.get("/response-time-by-severity", response_model=list[ResponseTimeBySeverity])
def response_time_by_severity(db: Session = Depends(get_db)):
    return AnalyticsService.response_time_by_severity(db)


@router.get("/incidents-by-system", response_model=list[IncidentsByGroup])
def incidents_by_system(db: Session = Depends(get_db)):
    return AnalyticsService.incidents_by_system(db)


@router.get("/incidents-by-department", response_model=list[IncidentsByGroup])
def incidents_by_department(db: Session = Depends(get_db)):
    return AnalyticsService.incidents_by_department(db)


@router.get("/high-risk-systems", response_model=list[HighRiskSystem])
def high_risk_systems(db: Session = Depends(get_db)):
    return AnalyticsService.high_risk_systems(db)


@router.get("/repeated-attacks", response_model=list[RepeatedAttack])
def repeated_attacks(db: Session = Depends(get_db)):
    return AnalyticsService.repeated_attacks(db)
