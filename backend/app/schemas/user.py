from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    department_id: int


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    department_id: int | None = None


class UserRead(BaseModel):
    user_id: int
    name: str
    email: str
    department_id: int
    department_name: str | None = None

    model_config = {"from_attributes": True}
