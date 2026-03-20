import datetime
import enum

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.attack_dim import AttackDim
from app.models.date_dim import DateDim
from app.models.system_dim import SystemDim
from app.models.user_dim import UserDim


class Severity(str, enum.Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"
    Critical = "Critical"


class Status(str, enum.Enum):
    Open = "Open"
    Investigating = "Investigating"
    Resolved = "Resolved"
    Closed = "Closed"


class IncidentFact(Base):
    __tablename__ = "incident_fact"

    incident_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    attack_type_id: Mapped[int] = mapped_column(ForeignKey("attack_dim.attack_type_id"), nullable=False)
    severity: Mapped[Severity] = mapped_column(Enum(Severity), nullable=False)
    system_id: Mapped[int] = mapped_column(ForeignKey("system_dim.system_id"), nullable=False)
    reported_by: Mapped[int] = mapped_column(ForeignKey("user_dim.user_id"), nullable=False)
    date_id: Mapped[int] = mapped_column(ForeignKey("date_dim.date_id"), nullable=False)
    incident_timestamp: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    response_time_minutes: Mapped[int | None] = mapped_column(Integer, comment="Filled when incident is resolved")
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[Status] = mapped_column(Enum(Status), nullable=False, default=Status.Open)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    attack_type: Mapped[AttackDim] = relationship()
    system: Mapped[SystemDim] = relationship()
    reporter: Mapped[UserDim] = relationship()
    date: Mapped[DateDim] = relationship()

    __table_args__ = (
        Index("idx_severity", "severity"),
        Index("idx_status", "status"),
        Index("idx_timestamp", "incident_timestamp"),
        Index("idx_date_id", "date_id"),
    )
