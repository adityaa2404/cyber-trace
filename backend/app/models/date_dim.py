import datetime

from sqlalchemy import Boolean, Date, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DateDim(Base):
    __tablename__ = "date_dim"

    date_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=False, comment="Format: YYYYMMDD")
    full_date: Mapped[datetime.date] = mapped_column(Date, unique=True, nullable=False)
    day_of_week: Mapped[int] = mapped_column(SmallInteger, nullable=False, comment="1=Monday, 7=Sunday")
    day_name: Mapped[str] = mapped_column(String(10), nullable=False)
    month: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    month_name: Mapped[str] = mapped_column(String(10), nullable=False)
    quarter: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    year: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    is_weekend: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
