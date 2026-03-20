from pydantic import BaseModel


class DepartmentCreate(BaseModel):
    department_name: str
    location: str | None = None


class DepartmentUpdate(BaseModel):
    department_name: str | None = None
    location: str | None = None


class DepartmentRead(BaseModel):
    department_id: int
    department_name: str
    location: str | None

    model_config = {"from_attributes": True}
