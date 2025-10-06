import logging
from typing import Optional

from app.db.firebase_client import db
from fastapi import HTTPException

from app.models.project_model import ProjectCreateModel

from app.schemas.project_schema import ProjectCreateSchema

# import time


from firebase_admin import firestore

logger = logging.getLogger(__name__)


# -------------------------Create Project-------------------------
async def create_project_service(
    project_data: ProjectCreateSchema,
):
    try:
        collection_ref = db.collection("Projects")

        # Firestore aggregation query for count
        count_query = collection_ref.count()
        count_result = count_query.get()

        project_count = int(count_result[0][0].value)  # 👈 cast to int

        project_id = f"PRJ-{project_count + 1}"

        # Create the model instance from incoming schema
        project_model = ProjectCreateModel(
            **project_data.model_dump(),
            project_id=project_id,
        )

        # Store in Firestore
        doc_ref = collection_ref.document(project_id)  # Auto-generated ID
        doc_ref.set(project_model.model_dump())

        logger.info(f"✅ Project {project_model.project_name} created successfully.")

        return {
            "success": True,
            **project_model.model_dump(),
            "message": "Project created successfully.",
        }

    except Exception as e:
        logger.error(f"❌ Failed to create project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create project")


# -------------------------View Projects-------------------------
# Without Search & Pagination
async def view_all_projects_service():
    try:
        collection_ref = db.collection("Projects")
        docs = collection_ref.stream()
        result = [doc.to_dict() for doc in docs]

        if not result:
            logger.error("❌ No projects found")
            raise HTTPException(status_code=404, detail="No projects found")

        return result

    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# =========With Search & Pagination=========
# async def view_and_search_projects_service(
#     search_type: Optional[str] = Query(None),
#     search_value: Optional[str] = Query(None),
#     cursor: Optional[str] = Query(None),
#     # limit: int = 10,
# ):
#     start_time = time.perf_counter()
#     try:
#         fields = [
#             "ProjectRegistrationNumber",
#             "FullName",
#             "PhoneNumber",
#             "ProjectType",
#             "LogDateTime",
#         ]

#         collection_ref_field = db.collection("collection_ProjectRegistration")
#         collection_ref = collection_ref_field.select(fields)

#         if search_type and search_value:
#             # 🔍 Search mode → no pagination, just fetch all
#             if search_type == "full_name":
#                 query = (
#                     collection_ref.order_by("FullName")
#                     .start_at([search_value])
#                     .end_at([search_value + "\uf8ff"])
#                 )
#             elif search_type == "phone_number":
#                 query = collection_ref.where("PhoneNumber", "==", int(search_value))
#             elif search_type == "registration_id":
#                 query = collection_ref.where(
#                     "ProjectRegistrationNumber", "==", str(search_value)
#                 )
#             else:
#                 query = collection_ref

#             docs = query.stream()
#             results = [doc.to_dict() | {"doc_id": doc.id} for doc in docs]

#             return {
#                 "success": True,
#                 "data": results,
#                 # "page_count": len(results),  # all results in one shot
#                 "next_cursor": None,  # 🚫 no pagination
#                 "total_count": len(results),
#             }

#         # 📄 Normal listing with pagination
#         else:
#             limit = 10

#             project_count_doc = db.collection("Count").document("count").get()
#             if project_count_doc.exists:
#                 total_docs = project_count_doc.to_dict().get("project_count", 0)
#             else:
#                 total_docs = 0

#             query = collection_ref.order_by("LogDateTime", direction="DESCENDING")

#             if cursor:
#                 cursor_doc = collection_ref_field.document(cursor).get()
#                 if cursor_doc.exists:
#                     query = query.start_after(cursor_doc)

#             query = query.limit(limit)
#             docs = query.get()

#             results = [doc.to_dict() | {"doc_id": doc.id} for doc in docs]
#             next_cursor = docs[-1].id if len(docs) == limit else None

#             return {
#                 "success": True,
#                 "data": results,
#                 # "page_count": len(results),
#                 "next_cursor": next_cursor,
#                 "total_count": total_docs,
#             }

#     except Exception as e:
#         logger.error(f"❌ Error: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# # -------------------------Get Project By Id-------------------------
async def get_project_by_id_service(projectId: str):
    global db
    try:
        # Query the collection for the project registration number
        query = db.collection("Projects").where("project_id", "==", projectId)

        docs = query.stream()
        result = next(docs, None)  # Get the first matching document

        if not result or not result.exists:
            logger.error(f"❌ Project not found with ID: {projectId}")
            raise HTTPException(
                status_code=404, detail=f"Project with ID {projectId} ID not found"
            )

        return result.to_dict()
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# # ---------------------------Update Project---------------------------
async def update_project_service(
    projectId: str,
    project_data: ProjectCreateSchema,
):
    try:

        # Create the model instance from incoming schema
        project_model = ProjectCreateModel(
            **project_data.model_dump(),
            project_id=projectId,
        )
        # Query the collection for the project registration number
        query = db.collection("Projects").where("project_id", "==", projectId)
        docs = query.stream()
        existing_doc = next(docs, None)

        if not existing_doc:
            logger.error(f"❌ Project not found with ID: {projectId}")
            raise HTTPException(status_code=404, detail="Project not found")

        # ✅ Update only the matched document
        existing_doc.reference.update(project_model.model_dump())

        # 🔁 Return updated data (optional: merge with new data)
        updated_snapshot = existing_doc.reference.get().to_dict()
        # updated_snapshot = updated_snapshot.to_dict()

        return {
            "success": True,
            "message": "Project updated successfully.",
            **updated_snapshot,
        }

    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# # ---------------------------Delete Project---------------------------
async def delete_project_service(projectId: str):
    try:
        # Query the collection for the project registration number
        query = db.collection("Projects").where("project_id", "==", projectId)
        docs = query.stream()
        existing_doc = next(docs, None)

        if not existing_doc:
            logger.error(f"❌ Project not found with ID: {projectId}")
            raise HTTPException(
                status_code=404, detail=f"Project with ID {projectId} ID not found"
            )

        # ✅ Delete only the matched document
        existing_doc.reference.delete()

        return {
            "success": True,
            "message": "Project with ID " + projectId + " deleted successfully.",
        }

    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
