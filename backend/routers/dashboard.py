from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from database import get_db
from auth_utils import get_current_user
import models

router = APIRouter()

@router.get("/")
def dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    memberships = db.query(models.ProjectMember).filter_by(user_id=user.id).all()
    project_ids = [m.project_id for m in memberships]

    all_tasks = db.query(models.Task).filter(models.Task.project_id.in_(project_ids)).all()

    # For members, only show their assigned tasks
    is_admin_somewhere = any(m.role == models.RoleEnum.admin for m in memberships)
    visible_tasks = all_tasks if is_admin_somewhere else [t for t in all_tasks if t.assignee_id == user.id]

    now = datetime.utcnow()
    by_status = {"todo": 0, "in_progress": 0, "done": 0}
    per_user = {}
    overdue = 0

    for t in visible_tasks:
        by_status[t.status.value] = by_status.get(t.status.value, 0) + 1
        if t.assignee:
            name = t.assignee.name
            per_user[name] = per_user.get(name, 0) + 1
        if t.due_date and t.due_date.replace(tzinfo=None) < now and t.status != models.StatusEnum.done:
            overdue += 1

    return {
        "total_tasks": len(visible_tasks),
        "by_status": by_status,
        "per_user": per_user,
        "overdue": overdue,
        "total_projects": len(project_ids)
    }
