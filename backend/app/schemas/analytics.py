from pydantic import BaseModel


class AttackFrequency(BaseModel):
    attack_type: str
    count: int


class IncidentTrend(BaseModel):
    date: str
    count: int


class ResponseTimeBySeverity(BaseModel):
    severity: str
    avg_minutes: float


class IncidentsByGroup(BaseModel):
    name: str
    count: int


class HighRiskSystem(BaseModel):
    system_name: str
    count: int
    latest_severity: str


class RepeatedAttack(BaseModel):
    attack_type: str
    system_name: str
    count: int
