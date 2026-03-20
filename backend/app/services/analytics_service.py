import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.attack_dim import AttackDim
from app.models.date_dim import DateDim
from app.models.department import Department
from app.models.incident_fact import IncidentFact
from app.models.system_dim import SystemDim


class AnalyticsService:

    @staticmethod
    def attack_frequency(db: Session) -> list[dict]:
        rows = (
            db.query(AttackDim.attack_type_name, func.count(IncidentFact.incident_id).label("count"))
            .join(IncidentFact, IncidentFact.attack_type_id == AttackDim.attack_type_id)
            .group_by(AttackDim.attack_type_name)
            .order_by(func.count(IncidentFact.incident_id).desc())
            .limit(10)
            .all()
        )
        return [{"attack_type": r[0], "count": r[1]} for r in rows]

    @staticmethod
    def incident_trends(db: Session, granularity: str = "daily") -> list[dict]:
        if granularity == "monthly":
            date_expr = func.date_format(IncidentFact.incident_timestamp, "%Y-%m")
        else:
            date_expr = func.date(IncidentFact.incident_timestamp)
        rows = (
            db.query(date_expr.label("date"), func.count(IncidentFact.incident_id).label("count"))
            .group_by("date")
            .order_by("date")
            .all()
        )
        return [{"date": str(r[0]), "count": r[1]} for r in rows]

    @staticmethod
    def response_time_by_severity(db: Session) -> list[dict]:
        rows = (
            db.query(
                IncidentFact.severity,
                func.avg(IncidentFact.response_time_minutes).label("avg_minutes"),
            )
            .filter(IncidentFact.response_time_minutes.isnot(None))
            .group_by(IncidentFact.severity)
            .all()
        )
        return [{"severity": r[0].value, "avg_minutes": round(float(r[1]), 1)} for r in rows]

    @staticmethod
    def incidents_by_system(db: Session) -> list[dict]:
        rows = (
            db.query(SystemDim.system_name, func.count(IncidentFact.incident_id).label("count"))
            .join(IncidentFact, IncidentFact.system_id == SystemDim.system_id)
            .group_by(SystemDim.system_name)
            .order_by(func.count(IncidentFact.incident_id).desc())
            .all()
        )
        return [{"name": r[0], "count": r[1]} for r in rows]

    @staticmethod
    def incidents_by_department(db: Session) -> list[dict]:
        rows = (
            db.query(Department.department_name, func.count(IncidentFact.incident_id).label("count"))
            .join(SystemDim, SystemDim.department_id == Department.department_id)
            .join(IncidentFact, IncidentFact.system_id == SystemDim.system_id)
            .group_by(Department.department_name)
            .order_by(func.count(IncidentFact.incident_id).desc())
            .all()
        )
        return [{"name": r[0], "count": r[1]} for r in rows]

    @staticmethod
    def high_risk_systems(db: Session) -> list[dict]:
        cutoff = datetime.datetime.now() - datetime.timedelta(days=30)
        sub = (
            db.query(
                IncidentFact.system_id,
                func.count(IncidentFact.incident_id).label("count"),
                func.max(IncidentFact.severity).label("latest_severity"),
            )
            .filter(IncidentFact.incident_timestamp >= cutoff)
            .group_by(IncidentFact.system_id)
            .subquery()
        )
        rows = (
            db.query(SystemDim.system_name, sub.c.count, sub.c.latest_severity)
            .join(sub, sub.c.system_id == SystemDim.system_id)
            .order_by(sub.c.count.desc())
            .limit(10)
            .all()
        )
        return [{"system_name": r[0], "count": r[1], "latest_severity": r[2] or "Unknown"} for r in rows]

    @staticmethod
    def repeated_attacks(db: Session) -> list[dict]:
        rows = (
            db.query(
                AttackDim.attack_type_name,
                SystemDim.system_name,
                func.count(IncidentFact.incident_id).label("count"),
            )
            .join(IncidentFact, IncidentFact.attack_type_id == AttackDim.attack_type_id)
            .join(SystemDim, IncidentFact.system_id == SystemDim.system_id)
            .group_by(AttackDim.attack_type_name, SystemDim.system_name)
            .having(func.count(IncidentFact.incident_id) > 1)
            .order_by(func.count(IncidentFact.incident_id).desc())
            .all()
        )
        return [{"attack_type": r[0], "system_name": r[1], "count": r[2]} for r in rows]
