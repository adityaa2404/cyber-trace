import datetime

from pydantic import BaseModel


class AlertLogRead(BaseModel):
    alert_id: int
    rule_id: int
    rule_name: str | None = None
    rule_type: str | None = None
    incident_id: int
    triggered_at: datetime.datetime
    message: str | None
    acknowledged: bool

    model_config = {"from_attributes": True}


class AlertCount(BaseModel):
    count: int
