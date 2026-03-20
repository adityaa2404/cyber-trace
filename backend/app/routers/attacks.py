from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.attack_category import AttackCategory
from app.models.attack_dim import AttackDim
from app.schemas.attack import (
    AttackCategoryCreate,
    AttackCategoryRead,
    AttackCategoryUpdate,
    AttackTypeCreate,
    AttackTypeRead,
    AttackTypeUpdate,
)

router = APIRouter(tags=["attacks"])


# --- Attack Categories ---
@router.get("/api/attack-categories", response_model=list[AttackCategoryRead])
def list_categories(db: Session = Depends(get_db)):
    return db.query(AttackCategory).all()


@router.post("/api/attack-categories", response_model=AttackCategoryRead, status_code=201)
def create_category(body: AttackCategoryCreate, db: Session = Depends(get_db)):
    cat = AttackCategory(**body.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.patch("/api/attack-categories/{category_id}", response_model=AttackCategoryRead)
def update_category(category_id: int, body: AttackCategoryUpdate, db: Session = Depends(get_db)):
    cat = db.get(AttackCategory, category_id)
    if not cat:
        raise HTTPException(404, "Attack category not found")
    for key, val in body.model_dump(exclude_unset=True).items():
        setattr(cat, key, val)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/api/attack-categories/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.get(AttackCategory, category_id)
    if not cat:
        raise HTTPException(404, "Attack category not found")
    db.delete(cat)
    db.commit()


# --- Attack Types ---
@router.get("/api/attack-types", response_model=list[AttackTypeRead])
def list_attack_types(db: Session = Depends(get_db)):
    rows = db.query(AttackDim).all()
    return [
        AttackTypeRead(
            attack_type_id=r.attack_type_id,
            attack_type_name=r.attack_type_name,
            category_id=r.category_id,
            category_name=r.category.category_name,
        )
        for r in rows
    ]


@router.post("/api/attack-types", response_model=AttackTypeRead, status_code=201)
def create_attack_type(body: AttackTypeCreate, db: Session = Depends(get_db)):
    at = AttackDim(**body.model_dump())
    db.add(at)
    db.commit()
    db.refresh(at)
    return AttackTypeRead(
        attack_type_id=at.attack_type_id,
        attack_type_name=at.attack_type_name,
        category_id=at.category_id,
        category_name=at.category.category_name,
    )


@router.patch("/api/attack-types/{attack_type_id}", response_model=AttackTypeRead)
def update_attack_type(attack_type_id: int, body: AttackTypeUpdate, db: Session = Depends(get_db)):
    at = db.get(AttackDim, attack_type_id)
    if not at:
        raise HTTPException(404, "Attack type not found")
    for key, val in body.model_dump(exclude_unset=True).items():
        setattr(at, key, val)
    db.commit()
    db.refresh(at)
    return AttackTypeRead(
        attack_type_id=at.attack_type_id,
        attack_type_name=at.attack_type_name,
        category_id=at.category_id,
        category_name=at.category.category_name,
    )


@router.delete("/api/attack-types/{attack_type_id}", status_code=204)
def delete_attack_type(attack_type_id: int, db: Session = Depends(get_db)):
    at = db.get(AttackDim, attack_type_id)
    if not at:
        raise HTTPException(404, "Attack type not found")
    db.delete(at)
    db.commit()
