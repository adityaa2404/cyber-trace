import datetime

from pydantic import BaseModel, field_validator

from app.models.incident_fact import Severity, Status


class IncidentCreate(BaseModel):
    attack_type_id: int
    severity: Severity
    system_id: int
    reported_by: int
    incident_timestamp: datetime.datetime
    response_time_minutes: int | None = None
    description: str | None = None
    status: Status = Status.Open

    @field_validator("incident_timestamp")
    @classmethod
    def timestamp_not_future(cls, v: datetime.datetime) -> datetime.datetime:
        if v > datetime.datetime.now() + datetime.timedelta(minutes=5):
            raise ValueError("incident_timestamp cannot be in the future")
        return v

    @field_validator("response_time_minutes")
    @classmethod
    def response_time_non_negative(cls, v: int | None) -> int | None:
        if v is not None and v < 0:
            raise ValueError("response_time_minutes must be >= 0")
        return v


class IncidentUpdate(BaseModel):
    attack_type_id: int | None = None
    severity: Severity | None = None
    system_id: int | None = None
    reported_by: int | None = None
    incident_timestamp: datetime.datetime | None = None
    response_time_minutes: int | None = None
    description: str | None = None
    status: Status | None = None


class IncidentRead(BaseModel):
    incident_id: int
    attack_type_id: int
    severity: Severity
    system_id: int
    reported_by: int
    date_id: int
    incident_timestamp: datetime.datetime
    response_time_minutes: int | None
    description: str | None
    status: Status
    created_at: datetime.datetime
    updated_at: datetime.datetime
    attack_type_name: str | None = None
    system_name: str | None = None
    reporter_name: str | None = None

    model_config = {"from_attributes": True}
