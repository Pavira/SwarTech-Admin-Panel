import logging
from fastapi import APIRouter, HTTPException
from app.schemas.project_schema import ProjectCreateSchema
from app.services.projects.project_service import (
    create_project_service,
    update_project_service,
    delete_project_service,
    get_project_by_id_service,
    view_all_projects_service,
)

from app.db.firebase_client import db

router = APIRouter(tags=["Projects"])

logger = logging.getLogger(__name__)


# -------------Add Project----------------
@router.post("/add_project")
async def add_project(project_data: ProjectCreateSchema):
    """
    API to create a new project record.
    """
    try:
        logger.info("Creating project with data:", project_data)
        # current_user = getattr(request.state, "current_user", None)
        result = await create_project_service(project_data)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------View Projects----------------
@router.get("/view_projects")
async def view_projects():
    """
    API to view all projects.
    """
    try:
        result = await view_all_projects_service()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.get("/view_and_search_projects")
# async def view_and_search_projects(
#     search_type: str = None,
#     search_value: str = None,
#     cursor: str = None,
#     # limit: int = None,
# ):
#     """
#     API to view and search projects.
#     """
#     try:
#         result = await view_and_search_projects_service(
#             search_type=search_type,
#             search_value=search_value,
#             cursor=cursor,
#             # limit=limit,
#         )
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # -------------Update Project----------------
@router.put("/{projectId}")
async def update_project(
    projectId: str,
    project_data: ProjectCreateSchema,
):
    """
    API to update a project record.
    """
    try:
        result = await update_project_service(projectId, project_data)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# # -------------Get Project By Id----------------
@router.get("/{projectId}")
async def get_project(projectId: str):
    """
    API to get a project record by ID.
    """
    try:
        result = await get_project_by_id_service(projectId)

        return result
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# # -------------Delete Project By Id----------------
@router.delete("/{projectId}")
async def delete_project(projectId: str):
    """
    API to delete a project record by ID.
    """
    try:
        result = await delete_project_service(projectId)
        return result
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
