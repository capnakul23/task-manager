from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth_utils import get_current_user
import models, schemas

router = APIRouter()

def get_member(db, project_id, user_id):
    return db.query(models.ProjectMember).filter_by(project_id=project_id, user_id=user_id).first()

@router.post("/{project_id}", response_model=schemas.TaskOut)
def create_task(project_id: int, data: schemas.TaskCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = get_member(db, project_id, user.id)
    if not m:
        raise HTTPException(status_code=403, detail="Not a member")
    if m.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can create tasks")
    task = models.Task(**data.model_dump(), project_id=project_id, created_by=user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/{project_id}", response_model=List[schemas.TaskOut])
def list_tasks(project_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = get_member(db, project_id, user.id)
    if not m:
        raise HTTPException(status_code=403, detail="Not a member")
    if m.role == models.RoleEnum.admin:
        return db.query(models.Task).filter_by(project_id=project_id).all()
    return db.query(models.Task).filter_by(project_id=project_id, assignee_id=user.id).all()

@router.patch("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, data: schemas.TaskUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(models.Task).filter_by(id=task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    m = get_member(db, task.project_id, user.id)
    if not m:
        raise HTTPException(status_code=403, detail="Not a member")
    # Members can only update status of their own tasks
    if m.role == models.RoleEnum.member:
        if task.assignee_id != user.id:
            raise HTTPException(status_code=403, detail="Not assigned to you")
        if data.model_dump(exclude_none=True).keys() - {"status"}:
            raise HTTPException(status_code=403, detail="Members can only update status")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(task, field, val)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(models.Task).filter_by(id=task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    m = get_member(db, task.project_id, user.id)
    if not m or m.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Admin only")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
