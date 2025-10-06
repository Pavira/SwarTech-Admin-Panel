from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, field_validator, validator


class ProjectCreateModel(BaseModel):
    project_id: str
    project_name: str = Field(..., alias="ProjectName")
    project_description: Optional[str] = Field(None, alias="ProjectDescription")
    client_name: Optional[str] = Field(None, alias="ClientName")
    client_industry_type: Optional[str] = Field(None, alias="ClientIndustryType")
    client_contact_name: Optional[str] = Field(None, alias="ClientContactName")
    client_contact_email: Optional[str] = Field(None, alias="ClientContactEmail")
    client_contact_phone: Optional[str] = Field(None, alias="ClientContactPhone")

    project_type: Optional[str] = Field(None, alias="ProjectType")
    project_category: Optional[str] = Field(None, alias="ProjectCategory")

    project_manager: Optional[str] = Field(None, alias="ProjectManager")
    assigned_team: Optional[str] = Field(None, alias="AssignedTeam")

    project_start_date: Optional[datetime] = Field(None, alias="ProjectStartDate")
    project_expected_end_date: Optional[datetime] = Field(
        None, alias="ProjectExpectedEndDate"
    )
    project_end_date: Optional[datetime] = Field(None, alias="ProjectEndDate")
    project_expected_duration: Optional[str] = Field(
        None, alias="ProjectExpectedDuration"
    )
    project_time_diff: Optional[str] = Field(None, alias="ProjectTimeDiff")
    project_duration: Optional[str] = Field(None, alias="ProjectDuration")
    project_status: Optional[str] = Field(None, alias="ProjectStatus")

    frontend_tech_stack: Optional[str] = Field(None, alias="FrontEndTechStack")
    backend_tech_stack: Optional[str] = Field(None, alias="BackEndTechStack")
    database: Optional[str] = Field(None, alias="Database")
    deployment_platform: Optional[str] = Field(None, alias="DeploymentPlatform")

    functional_requirement_document: Optional[str] = Field(
        None, alias="FunctionalRequirementDocument"
    )
    change_request_document: Optional[str] = Field(None, alias="ChangeRequestDocument")
    design_document: Optional[str] = Field(None, alias="DesignDocument")
    test_cases_document: Optional[str] = Field(None, alias="TestCasesDocument")
    user_manual_document: Optional[str] = Field(None, alias="UserManualDocument")
    source_code: Optional[str] = Field(None, alias="SourceCode")

    log_datetime: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Apply same logic to all three date fields
    # @field_validator(
    #     "project_start_date",
    #     "project_expected_end_date",
    #     "project_end_date",
    #     mode="before",
    # )
    # def ensure_timestamp_with_current_time(cls, v):
    #     if v is None:
    #         return None
    #     if isinstance(v, str):
    #         v = datetime.fromisoformat(v)  # parse user input string

    #     # Get current UTC time
    #     now = datetime.now(timezone.utc)

    #     # Replace only time part with current time, keep user date
    #     v = v.replace(
    #         hour=now.hour,
    #         minute=now.minute,
    #         second=now.second,
    #         microsecond=now.microsecond,
    #         tzinfo=timezone.utc,
    #     )
    #     return v


# class ProjectUpdateModel(BaseModel):
#     project_name: str = Field(..., alias="ProjectName")
#     project_description: Optional[str] = Field(None, alias="ProjectDescription")
#     client_name: Optional[str] = Field(None, alias="ClientName")
#     client_industry_type: Optional[str] = Field(None, alias="ClientIndustryType")
#     client_contact_name: Optional[str] = Field(None, alias="ClientContactName")
#     client_contact_email: Optional[str] = Field(None, alias="ClientContactEmail")
#     client_contact_phone: Optional[str] = Field(None, alias="ClientContactPhone")

#     project_type: Optional[str] = Field(None, alias="ProjectType")
#     project_category: Optional[str] = Field(None, alias="ProjectCategory")

#     project_manager: Optional[str] = Field(None, alias="ProjectManager")
#     assigned_team: Optional[str] = Field(None, alias="AssignedTeam")

#     project_start_date: Optional[datetime] = Field(None, alias="ProjectStartDate")
#     project_expected_end_date: Optional[datetime] = Field(
#         None, alias="ProjectExpectedEndDate"
#     )
#     project_expected_duration: Optional[str] = Field(
#         None, alias="ProjectExpectedDuration"
#     )
#     project_end_date: Optional[datetime] = Field(None, alias="ProjectEndDate")
#     project_duration: Optional[str] = Field(None, alias="ProjectDuration")
#     project_time_diff: Optional[str] = Field(None, alias="ProjectTimeDiff")
#     project_status: Optional[str] = Field(None, alias="ProjectStatus")

#     frontend_tech_stack: Optional[str] = Field(None, alias="FrontEndTechStack")
#     backend_tech_stack: Optional[str] = Field(None, alias="BackEndTechStack")
#     database: Optional[str] = Field(None, alias="Database")
#     deployment_platform: Optional[str] = Field(None, alias="DeploymentPlatform")

#     functional_requirement_document: Optional[str] = Field(
#         None, alias="FunctionalRequirementDocument"
#     )
#     change_request_document: Optional[str] = Field(None, alias="ChangeRequestDocument")
#     design_document: Optional[str] = Field(None, alias="DesignDocument")
#     test_cases_document: Optional[str] = Field(None, alias="TestCasesDocument")
#     user_manual_document: Optional[str] = Field(None, alias="UserManualDocument")
#     source_code: Optional[str] = Field(None, alias="SourceCode")

#     modfied_datetime: datetime = Field(
#         default_factory=lambda: datetime.now(timezone.utc)
#     )
