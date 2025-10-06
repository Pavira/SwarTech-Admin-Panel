from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ProjectCreateSchema(BaseModel):
    ProjectName: str
    ProjectDescription: Optional[str]
    ClientName: Optional[str]
    ClientIndustryType: Optional[str]
    ClientContactName: Optional[str]
    ClientContactEmail: Optional[str]
    ClientContactPhone: Optional[str]

    ProjectType: Optional[str]
    ProjectCategory: Optional[str]

    ProjectManager: Optional[str]
    AssignedTeam: Optional[str]

    ProjectStartDate: Optional[datetime]
    ProjectExpectedEndDate: Optional[datetime]
    ProjectExpectedDuration: Optional[str]
    ProjectEndDate: Optional[datetime]
    ProjectDuration: Optional[str]
    ProjectTimeDiff: Optional[str]
    ProjectStatus: Optional[str]

    FrontEndTechStack: Optional[str]
    BackEndTechStack: Optional[str]
    Database: Optional[str]
    DeploymentPlatform: Optional[str]

    FunctionalRequirementDocument: Optional[str]
    ChangeRequestDocument: Optional[str]
    DesignDocument: Optional[str]
    TestCasesDocument: Optional[str]
    UserManualDocument: Optional[str]
    SourceCode: Optional[str]
