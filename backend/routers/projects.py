from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth_utils import get_current_user
import models, schemas

router = APIRouter()

def get_member(db, project_id, user_id):
    return db.query(models.ProjectMember).filter_by(project_id=project_id, user_id=user_id).first()

def require_admin(db, project_id, user_id):
    m = get_member(db, project_id, user_id)
    if not m or m.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return m

@router.post("/", response_model=schemas.ProjectOut)
def create_project(data: schemas.ProjectCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    project = models.Project(name=data.name, description=data.description, created_by=user.id)
    db.add(project)
    db.flush()
    membership = models.ProjectMember(project_id=project.id, user_id=user.id, role=models.RoleEnum.admin)
    db.add(membership)
    db.commit()
    db.refresh(project)
    return project

@router.get("/", response_model=List[schemas.ProjectOut])
def list_projects(db: Session = Depends(get_db), user=Depends(get_current_user)):
    memberships = db.query(models.ProjectMember).filter_by(user_id=user.id).all()
    project_ids = [m.project_id for m in memberships]
    return db.query(models.Project).filter(models.Project.id.in_(project_ids)).all()

@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not get_member(db, project_id, user.id):
        raise HTTPException(status_code=403, detail="Not a member")
    project = db.query(models.Project).filter_by(id=project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/{project_id}/members")
def add_member(project_id: int, data: schemas.MemberAdd, db: Session = Depends(get_db), user=Depends(get_current_user)):
    require_admin(db, project_id, user.id)
    target = db.query(models.User).filter_by(email=data.email).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if get_member(db, project_id, target.id):
        raise HTTPException(status_code=400, detail="Already a member")
    db.add(models.ProjectMember(project_id=project_id, user_id=target.id, role=data.role))
    db.commit()
    return {"message": "Member added"}

@router.delete("/{project_id}/members/{user_id}")
def remove_member(project_id: int, user_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    require_admin(db, project_id, user.id)
    m = get_member(db, project_id, user_id)
    if not m:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(m)
    db.commit()
    return {"message": "Member removed"}
