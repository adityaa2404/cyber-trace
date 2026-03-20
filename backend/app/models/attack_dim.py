from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.attack_category import AttackCategory


class AttackDim(Base):
    __tablename__ = "attack_dim"

    attack_type_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    attack_type_name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("attack_category.category_id"), nullable=False)

    category: Mapped[AttackCategory] = relationship(back_populates="attack_types")
