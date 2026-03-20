from pydantic import BaseModel


class SystemCreate(BaseModel):
    system_name: str
    system_type: str
    department_id: int


class SystemUpdate(BaseModel):
    system_name: str | None = None
    system_type: str | None = None
    department_id: int | None = None


class SystemRead(BaseModel):
    system_id: int
    system_name: str
    system_type: str
    department_id: int
    department_name: str | None = None

    model_config = {"from_attributes": True}
