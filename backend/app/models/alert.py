import datetime
import enum

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.incident_fact import IncidentFact


class RuleType(str, enum.Enum):
    high_severity = "high_severity"
    repeated_attack = "repeated_attack"


class AlertRule(Base):
    __tablename__ = "alert_rule"

    rule_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    rule_name: Mapped[str] = mapped_column(String(200), nullable=False)
    rule_type: Mapped[RuleType] = mapped_column(Enum(RuleType), nullable=False)
    threshold: Mapped[int | None] = mapped_column(Integer, comment="e.g. 3 = alert after 3 repeated attacks")
    window_minutes: Mapped[int | None] = mapped_column(Integer, comment="Time window for repeated-attack checks")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class AlertLog(Base):
    __tablename__ = "alert_log"

    alert_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    rule_id: Mapped[int] = mapped_column(ForeignKey("alert_rule.rule_id"), nullable=False)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incident_fact.incident_id", ondelete="CASCADE"), nullable=False)
    triggered_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    message: Mapped[str | None] = mapped_column(Text, comment="Human-readable alert description")
    acknowledged: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    rule: Mapped[AlertRule] = relationship()
    incident: Mapped[IncidentFact] = relationship()

    __table_args__ = (
        Index("idx_acknowledged", "acknowledged"),
        Index("idx_triggered_at", "triggered_at"),
    )
