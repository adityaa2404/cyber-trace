from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.department import Department
from app.schemas.department import DepartmentCreate, DepartmentRead, DepartmentUpdate

router = APIRouter(prefix="/api/departments", tags=["departments"])


@router.get("", response_model=list[DepartmentRead])
def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()


@router.get("/{department_id}", response_model=DepartmentRead)
def get_department(department_id: int, db: Session = Depends(get_db)):
    dept = db.get(Department, department_id)
    if not dept:
        raise HTTPException(404, "Department not found")
    return dept


@router.post("", response_model=DepartmentRead, status_code=201)
def create_department(body: DepartmentCreate, db: Session = Depends(get_db)):
    dept = Department(**body.model_dump())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept


@router.patch("/{department_id}", response_model=DepartmentRead)
def update_department(department_id: int, body: DepartmentUpdate, db: Session = Depends(get_db)):
    dept = db.get(Department, department_id)
    if not dept:
        raise HTTPException(404, "Department not found")
    for key, val in body.model_dump(exclude_unset=True).items():
        setattr(dept, key, val)
    db.commit()
    db.refresh(dept)
    return dept


@router.delete("/{department_id}", status_code=204)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    dept = db.get(Department, department_id)
    if not dept:
        raise HTTPException(404, "Department not found")
    db.delete(dept)
    db.commit()
