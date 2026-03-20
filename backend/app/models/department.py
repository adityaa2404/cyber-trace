from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Department(Base):
    __tablename__ = "department"

    department_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    department_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    location: Mapped[str | None] = mapped_column(String(200))

    users: Mapped[list["UserDim"]] = relationship(back_populates="department")  # noqa: F821
    systems: Mapped[list["SystemDim"]] = relationship(back_populates="department")  # noqa: F821
