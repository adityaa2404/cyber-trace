from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.system_dim import SystemDim
from app.schemas.system import SystemCreate, SystemRead, SystemUpdate

router = APIRouter(prefix="/api/systems", tags=["systems"])


@router.get("", response_model=list[SystemRead])
def list_systems(db: Session = Depends(get_db)):
    rows = db.query(SystemDim).all()
    return [
        SystemRead(
            system_id=r.system_id,
            system_name=r.system_name,
            system_type=r.system_type,
            department_id=r.department_id,
            department_name=r.department.department_name,
        )
        for r in rows
    ]


@router.get("/{system_id}", response_model=SystemRead)
def get_system(system_id: int, db: Session = Depends(get_db)):
    sys = db.get(SystemDim, system_id)
    if not sys:
        raise HTTPException(404, "System not found")
    return SystemRead(
        system_id=sys.system_id,
        system_name=sys.system_name,
        system_type=sys.system_type,
        department_id=sys.department_id,
        department_name=sys.department.department_name,
    )


@router.post("", response_model=SystemRead, status_code=201)
def create_system(body: SystemCreate, db: Session = Depends(get_db)):
    sys = SystemDim(**body.model_dump())
    db.add(sys)
    db.commit()
    db.refresh(sys)
    return SystemRead(
        system_id=sys.system_id,
        system_name=sys.system_name,
        system_type=sys.system_type,
        department_id=sys.department_id,
        department_name=sys.department.department_name,
    )


@router.patch("/{system_id}", response_model=SystemRead)
def update_system(system_id: int, body: SystemUpdate, db: Session = Depends(get_db)):
    sys = db.get(SystemDim, system_id)
    if not sys:
        raise HTTPException(404, "System not found")
    for key, val in body.model_dump(exclude_unset=True).items():
        setattr(sys, key, val)
    db.commit()
    db.refresh(sys)
    return SystemRead(
        system_id=sys.system_id,
        system_name=sys.system_name,
        system_type=sys.system_type,
        department_id=sys.department_id,
        department_name=sys.department.department_name,
    )


@router.delete("/{system_id}", status_code=204)
def delete_system(system_id: int, db: Session = Depends(get_db)):
    sys = db.get(SystemDim, system_id)
    if not sys:
        raise HTTPException(404, "System not found")
    db.delete(sys)
    db.commit()
