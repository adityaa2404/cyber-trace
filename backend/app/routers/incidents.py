import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.incident_fact import IncidentFact, Severity, Status
from app.schemas.incident import IncidentCreate, IncidentRead, IncidentUpdate
from app.services.incident_service import create_incident, to_incident_read

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("", response_model=list[IncidentRead])
def list_incidents(
    skip: int = 0,
    limit: int = Query(default=50, le=200),
    severity: Severity | None = None,
    status: Status | None = None,
    system_id: int | None = None,
    from_date: datetime.date | None = None,
    to_date: datetime.date | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(IncidentFact)
    if severity:
        q = q.filter(IncidentFact.severity == severity)
    if status:
        q = q.filter(IncidentFact.status == status)
    if system_id:
        q = q.filter(IncidentFact.system_id == system_id)
    if from_date:
        q = q.filter(IncidentFact.incident_timestamp >= datetime.datetime.combine(from_date, datetime.time.min))
    if to_date:
        q = q.filter(IncidentFact.incident_timestamp <= datetime.datetime.combine(to_date, datetime.time.max))
    rows = q.order_by(IncidentFact.incident_timestamp.desc()).offset(skip).limit(limit).all()
    return [to_incident_read(r) for r in rows]


@router.get("/{incident_id}", response_model=IncidentRead)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    inc = db.get(IncidentFact, incident_id)
    if not inc:
        raise HTTPException(404, "Incident not found")
    return to_incident_read(inc)


@router.post("", response_model=IncidentRead, status_code=201)
def create_incident_endpoint(body: IncidentCreate, db: Session = Depends(get_db)):
    inc = create_incident(db, body)
    return to_incident_read(inc)


@router.patch("/{incident_id}", response_model=IncidentRead)
def update_incident(incident_id: int, body: IncidentUpdate, db: Session = Depends(get_db)):
    inc = db.get(IncidentFact, incident_id)
    if not inc:
        raise HTTPException(404, "Incident not found")
    updates = body.model_dump(exclude_unset=True)
    if "incident_timestamp" in updates:
        ts = updates["incident_timestamp"]
        updates["date_id"] = int(ts.strftime("%Y%m%d"))
    for key, val in updates.items():
        setattr(inc, key, val)
    db.commit()
    db.refresh(inc)
    return to_incident_read(inc)


@router.delete("/{incident_id}", status_code=204)
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    inc = db.get(IncidentFact, incident_id)
    if not inc:
        raise HTTPException(404, "Incident not found")
    db.delete(inc)
    db.commit()
