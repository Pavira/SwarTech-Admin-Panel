// edit_projects.js

// --------------- Project Duration Calculation ---------------

function initDurationCalculation() {
  const startDateInput = document.getElementById("startDate");
  const expectedEndDateInput = document.getElementById("expectedEndDate");
  const actualEndDateInput = document.getElementById("actualEndDate");

  const expectedDurationField = document.getElementById("expectedDuration");
  const actualDurationField = document.getElementById("actualDuration");
  const timeDiffField = document.getElementById("timeDiff");

  function calculateDurations() {
    const startDate = new Date(startDateInput.value);
    const expectedEndDate = new Date(expectedEndDateInput.value);
    const actualEndDate = new Date(actualEndDateInput.value);

    let expectedDuration = null;
    let actualDuration = null;

    // --- Expected Duration ---
    if (startDate && expectedEndDate && !isNaN(startDate) && !isNaN(expectedEndDate) && expectedEndDate >= startDate) {
      const diffTime = expectedEndDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      expectedDuration = diffDays;
      expectedDurationField.value = `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else {
      expectedDurationField.value = "";
    }

    // --- Actual Duration ---
    if (startDate && actualEndDate && !isNaN(startDate) && !isNaN(actualEndDate) && actualEndDate >= startDate) {
      const diffTime = actualEndDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      actualDuration = diffDays;
      actualDurationField.value = `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else {
      actualDurationField.value = "";
    }

    // --- Time Difference (Actual - Expected) ---
    if (expectedDuration !== null && actualDuration !== null) {
      const diff = actualDuration - expectedDuration;
      if (diff === 0) {
        timeDiffField.value = "On Time";
      } else if (diff > 0) {
        timeDiffField.value = `${diff} day${diff > 1 ? "s" : ""} Delay`;
      } else {
        timeDiffField.value = `${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""} Early`;
      }
    } else {
      timeDiffField.value = "";
    }
  }

  startDateInput.addEventListener("change", calculateDurations);
  expectedEndDateInput.addEventListener("change", calculateDurations);
  actualEndDateInput.addEventListener("change", calculateDurations);
}

initDurationCalculation();

// ✅ Convert any valid date string to yyyy-MM-dd
function formatToDateInput(dateString) {
  if (!dateString) return ""; // handle null/undefined safely
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch (err) {
    console.error("Invalid date string:", dateString, err);
    return "";
  }
}


function initEditProjectPage() {
  const params = window.pageParams || {};
  const projectId = params.project_id;

  if (!projectId) {
    alert("No Project ID provided!");
    return;
  }

  // DOM Elements
  const form = document.getElementById("edit-project-form");
  const deleteBtn = document.getElementById("deleteProjectBtn");

  // Fill Project ID
  document.getElementById("projectId").value = projectId;

  // Function to fetch project info
  async function fetchProject() {
    try {
      const res = await fetch(`/api/v1/project/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project data");

      const p = await res.json();

      // Fill form fields
      document.getElementById("projectName").value = p.project_name || "";
      document.getElementById("projectDescription").value = p.project_description || "";
      document.getElementById("clientName").value = p.client_name || "";
      document.getElementById("clientIndustry").value = p.client_industry_type || "";
      document.getElementById("clientContactName").value = p.client_contact_name || "";
      document.getElementById("clientContactEmail").value = p.client_contact_email || "";
      document.getElementById("clientContactPhone").value = p.client_contact_phone || "";

      document.getElementById("projectType").value = p.project_type || "";
      document.getElementById("projectCategory").value = p.project_category || "";

      document.getElementById("projectManager").value = p.project_manager || "";
      document.getElementById("assignedTeam").value = p.assigned_team || "";

      document.getElementById("frontEndTech").value = p.frontend_tech_stack || "";
      document.getElementById("backEndTech").value = p.backend_tech_stack || "";
      document.getElementById("database").value = p.database || "";
      document.getElementById("deploymentPlatform").value = p.deployment_platform || "";

      document.getElementById("frsLink").value = p.functional_requirement_document || "";
      document.getElementById("changeRequestLink").value = p.change_request_document || "";
      document.getElementById("designDocLink").value = p.design_document || "";
      document.getElementById("testCasesLink").value = p.test_cases_document || "";
      document.getElementById("userManualLink").value = p.user_manual_document || "";
      document.getElementById("sourceCodeLink").value = p.source_code || "";

      document.getElementById("startDate").value = formatToDateInput(p.project_start_date) || "";
      document.getElementById("expectedEndDate").value = formatToDateInput(p.project_expected_end_date) || "";
      document.getElementById("expectedDuration").value = p.project_expected_duration || "";
      document.getElementById("actualEndDate").value = formatToDateInput(p.project_end_date) || "";
      document.getElementById("actualDuration").value = p.project_duration || "";
      document.getElementById("timeDiff").value = p.project_time_diff || "";
      document.getElementById("status").value = p.project_status || "";

    } catch (error) {
      console.error("Error fetching project:", error);
      alert("Error loading project data!");
    }
  }

  fetchProject();

  // Update Project
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
  ProjectName: document.getElementById("projectName").value.trim(),
  ProjectDescription: document.getElementById("projectDescription").value.trim(),
  ClientName: document.getElementById("clientName").value.trim(),
  ClientIndustryType: document.getElementById("clientIndustry").value.trim(),
  ClientContactName: document.getElementById("clientContactName").value.trim(),
  ClientContactEmail: document.getElementById("clientContactEmail").value.trim(),
  ClientContactPhone: document.getElementById("clientContactPhone").value.trim(),

  ProjectType: document.getElementById("projectType").value.trim(),
  ProjectCategory: document.getElementById("projectCategory").value.trim(),

  ProjectManager: document.getElementById("projectManager").value.trim(),
  AssignedTeam: document.getElementById("assignedTeam").value.trim(),

  ProjectStartDate: document.getElementById("startDate").value || null,
  ProjectExpectedEndDate: document.getElementById("expectedEndDate").value || null,
  ProjectExpectedDuration: document.getElementById("expectedDuration").value || null,
  ProjectEndDate: document.getElementById("actualEndDate").value || null,
  ProjectDuration: document.getElementById("actualDuration").value || null,
  ProjectTimeDiff: document.getElementById("timeDiff").value || null,
  ProjectStatus: document.getElementById("status").value.trim(),

  FrontEndTechStack: document.getElementById("frontEndTech").value.trim(),
  BackEndTechStack: document.getElementById("backEndTech").value.trim(),
  Database: document.getElementById("database").value.trim(),
  DeploymentPlatform: document.getElementById("deploymentPlatform").value.trim(),

  FunctionalRequirementDocument: document.getElementById("frsLink").value.trim(),
  ChangeRequestDocument: document.getElementById("changeRequestLink").value.trim(),
  DesignDocument: document.getElementById("designDocLink").value.trim(),
  TestCasesDocument: document.getElementById("testCasesLink").value.trim(),
  UserManualDocument: document.getElementById("userManualLink").value.trim(),
  SourceCode: document.getElementById("sourceCodeLink").value.trim(),
};


try {
    const res = await fetch(`/api/v1/project/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Project updated successfully!",
        confirmButtonText: "OK",
      }).then(() => {
        loadPage("project/view_projects");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: result.message || "Failed to update project",
      });
    }
  } catch (err) {
    console.error("Update error:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while updating the project!",
    });
  }
});

// Delete Project
deleteBtn.addEventListener("click", async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the project!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/v1/project/${projectId}`, {
          method: "DELETE",
        });
        const resultJson = await res.json();
        if (res.ok && resultJson.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Project deleted successfully!",
            confirmButtonText: "OK",
          }).then(() => {
            loadPage("project/view_projects");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: resultJson.message || "Failed to delete project",
          });
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while deleting the project!",
        });
      }
    }
  });
});
}

// Make it globally accessible
window.initEditProjectPage = initEditProjectPage;
