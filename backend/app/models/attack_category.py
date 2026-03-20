from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AttackCategory(Base):
    __tablename__ = "attack_category"

    category_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    attack_types: Mapped[list["AttackDim"]] = relationship(back_populates="category")  # noqa: F821
