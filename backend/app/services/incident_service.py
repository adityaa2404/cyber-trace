from sqlalchemy.orm import Session

from app.models.incident_fact import IncidentFact
from app.schemas.incident import IncidentCreate, IncidentRead
from app.services.alert_service import evaluate_alerts


def create_incident(db: Session, body: IncidentCreate) -> IncidentFact:
    date_id = int(body.incident_timestamp.strftime("%Y%m%d"))
    inc = IncidentFact(**body.model_dump(), date_id=date_id)
    db.add(inc)
    db.commit()
    db.refresh(inc)
    evaluate_alerts(db, inc)
    return inc


def to_incident_read(inc: IncidentFact) -> IncidentRead:
    return IncidentRead(
        incident_id=inc.incident_id,
        attack_type_id=inc.attack_type_id,
        severity=inc.severity,
        system_id=inc.system_id,
        reported_by=inc.reported_by,
        date_id=inc.date_id,
        incident_timestamp=inc.incident_timestamp,
        response_time_minutes=inc.response_time_minutes,
        description=inc.description,
        status=inc.status,
        created_at=inc.created_at,
        updated_at=inc.updated_at,
        attack_type_name=inc.attack_type.attack_type_name if inc.attack_type else None,
        system_name=inc.system.system_name if inc.system else None,
        reporter_name=inc.reporter.name if inc.reporter else None,
    )
