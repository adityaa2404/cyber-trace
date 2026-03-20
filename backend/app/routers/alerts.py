from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.alert import AlertLog
from app.schemas.alert import AlertCount, AlertLogRead

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("", response_model=list[AlertLogRead])
def list_alerts(acknowledged: bool | None = None, db: Session = Depends(get_db)):
    q = db.query(AlertLog)
    if acknowledged is not None:
        q = q.filter(AlertLog.acknowledged == acknowledged)
    rows = q.order_by(AlertLog.triggered_at.desc()).all()
    return [
        AlertLogRead(
            alert_id=r.alert_id,
            rule_id=r.rule_id,
            rule_name=r.rule.rule_name,
            rule_type=r.rule.rule_type.value,
            incident_id=r.incident_id,
            triggered_at=r.triggered_at,
            message=r.message,
            acknowledged=r.acknowledged,
        )
        for r in rows
    ]


@router.get("/unacknowledged-count", response_model=AlertCount)
def unacknowledged_count(db: Session = Depends(get_db)):
    count = db.query(AlertLog).filter(AlertLog.acknowledged == False).count()  # noqa: E712
    return AlertCount(count=count)


@router.patch("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.get(AlertLog, alert_id)
    if not alert:
        raise HTTPException(404, "Alert not found")
    alert.acknowledged = True
    db.commit()
    return {"status": "acknowledged"}
