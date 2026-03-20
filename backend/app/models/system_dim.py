from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.department import Department


class SystemDim(Base):
    __tablename__ = "system_dim"

    system_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    system_name: Mapped[str] = mapped_column(String(200), nullable=False)
    system_type: Mapped[str] = mapped_column(String(100), nullable=False, comment="e.g. Web Server, Database, Firewall")
    department_id: Mapped[int] = mapped_column(ForeignKey("department.department_id"), nullable=False)

    department: Mapped[Department] = relationship(back_populates="systems")
