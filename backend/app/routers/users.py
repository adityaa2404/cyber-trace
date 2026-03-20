from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user_dim import UserDim
from app.schemas.user import UserCreate, UserRead, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db)):
    rows = db.query(UserDim).all()
    return [
        UserRead(
            user_id=r.user_id,
            name=r.name,
            email=r.email,
            department_id=r.department_id,
            department_name=r.department.department_name,
        )
        for r in rows
    ]


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(UserDim, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return UserRead(
        user_id=user.user_id,
        name=user.name,
        email=user.email,
        department_id=user.department_id,
        department_name=user.department.department_name,
    )


@router.post("", response_model=UserRead, status_code=201)
def create_user(body: UserCreate, db: Session = Depends(get_db)):
    user = UserDim(**body.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserRead(
        user_id=user.user_id,
        name=user.name,
        email=user.email,
        department_id=user.department_id,
        department_name=user.department.department_name,
    )


@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, body: UserUpdate, db: Session = Depends(get_db)):
    user = db.get(UserDim, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    for key, val in body.model_dump(exclude_unset=True).items():
        setattr(user, key, val)
    db.commit()
    db.refresh(user)
    return UserRead(
        user_id=user.user_id,
        name=user.name,
        email=user.email,
        department_id=user.department_id,
        department_name=user.department.department_name,
    )


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(UserDim, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    db.delete(user)
    db.commit()
