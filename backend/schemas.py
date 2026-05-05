from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, StatusEnum, PriorityEnum

# Auth
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Projects
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class MemberAdd(BaseModel):
    email: str
    role: RoleEnum = RoleEnum.member

class MemberOut(BaseModel):
    id: int
    user: UserOut
    role: RoleEnum
    class Config:
        from_attributes = True

class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    members: List[MemberOut] = []
    class Config:
        from_attributes = True

# Tasks
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: PriorityEnum = PriorityEnum.medium
    assignee_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    assignee_id: Optional[int] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    priority: PriorityEnum
    status: StatusEnum
    project_id: int
    assignee: Optional[UserOut]
    created_at: datetime
    class Config:
        from_attributes = True
