from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.department import Department


class UserDim(Base):
    __tablename__ = "user_dim"

    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    department_id: Mapped[int] = mapped_column(ForeignKey("department.department_id"), nullable=False)

    department: Mapped[Department] = relationship(back_populates="users")
