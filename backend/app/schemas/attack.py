from pydantic import BaseModel


# --- Attack Category ---
class AttackCategoryCreate(BaseModel):
    category_name: str
    description: str | None = None


class AttackCategoryUpdate(BaseModel):
    category_name: str | None = None
    description: str | None = None


class AttackCategoryRead(BaseModel):
    category_id: int
    category_name: str
    description: str | None

    model_config = {"from_attributes": True}


# --- Attack Type ---
class AttackTypeCreate(BaseModel):
    attack_type_name: str
    category_id: int


class AttackTypeUpdate(BaseModel):
    attack_type_name: str | None = None
    category_id: int | None = None


class AttackTypeRead(BaseModel):
    attack_type_id: int
    attack_type_name: str
    category_id: int
    category_name: str | None = None

    model_config = {"from_attributes": True}
