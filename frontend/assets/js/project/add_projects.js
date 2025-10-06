console.log("add_projects.js loaded");

// --------------- Back Button ---------------
function initBackButton() {
  document.getElementById("backButton").addEventListener("click", function () {
    loadPage("projects/view_projects");
  });
}
initBackButton();

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

// --------------- Form Validation ---------------
function validateProjectForm() {
  const projectName = document.getElementById("projectName").value.trim();
  const projectType = document.getElementById("projectType").value.trim();
  const status = document.getElementById("status").value.trim();

  let missingFields = [];
  if (!projectName) missingFields.push("Project Name");
  if (!projectType) missingFields.push("Project Type");
  if (!status) missingFields.push("Current Status");

  if (missingFields.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      html: `
        <p>Please fill in the following required fields:</p>
        <ul style="text-align:left;">
          ${missingFields.map(field => `<li>${field}</li>`).join("")}
        </ul>
      `
    });
    return false;
  }
  return true;
}

// --------------- Add Project Form Submission ---------------
function initAddProjectForm() {
  const projectForm = document.getElementById("add-project-form");
  if (!projectForm) {
    console.warn("⛔ Form not found!");
    return;
  }

  projectForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate
    if (!validateProjectForm()) return;

    // Collect Data
    const data = {
      ProjectName: document.getElementById("projectName").value.trim(),
      ProjectDescription: document.getElementById("projectDescription").value.trim(),
      ClientName: document.getElementById("clientName").value.trim(),
      ClientIndustryType: document.getElementById("clientIndustry").value,
      ClientContactName: document.getElementById("clientContactName").value.trim(),
      ClientContactEmail: document.getElementById("clientContactEmail").value.trim(),
      ClientContactPhone: document.getElementById("clientContactPhone").value.trim(),
      ProjectType: document.getElementById("projectType").value,
      ProjectCategory: document.getElementById("projectCategory").value,
      ProjectManager: document.getElementById("projectManager").value.trim(),
      AssignedTeam: document.getElementById("assignedTeam").value.trim(),
      ProjectStartDate: document.getElementById("startDate").value || null,
      ProjectExpectedEndDate: document.getElementById("expectedEndDate").value || null,
      ProjectExpectedDuration: document.getElementById("expectedDuration").value || null,
      ProjectEndDate: document.getElementById("actualEndDate").value || null,
      ProjectDuration: document.getElementById("actualDuration").value || null,
      ProjectTimeDiff: document.getElementById("timeDiff").value || null,
      ProjectStatus: document.getElementById("status").value,
      FrontEndTechStack: document.getElementById("frontEndTech").value.trim(),
      BackEndTechStack: document.getElementById("backEndTech").value.trim(),
      Database: document.getElementById("database").value.trim(),
      DeploymentPlatform: document.getElementById("deploymentPlatform").value.trim(),
      FunctionalRequirementDocument: document.getElementById("frsLink").value.trim(),
      ChangeRequestDocument: document.getElementById("changeRequestLink").value.trim(),
      DesignDocument: document.getElementById("designDocLink").value.trim(),
      TestCasesDocument: document.getElementById("testCasesLink").value.trim(),
      UserManualDocument: document.getElementById("userManualLink").value.trim(),
      SourceCode: document.getElementById("sourceCodeLink").value.trim()
    };

    console.log("Sending project data:", data);

    // Show loader
    showLoader();

    try {
      // const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/project/add_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          icon: "success",
          title: "Project created successfully!",
          text: `Project ID: ${result.project_id || "N/A"}`,
          confirmButtonText: "OK"
        }).then(() => {
          loadPage("project/view_projects");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "⛔ Project creation failed",
          text: result.message || "Please try again."
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "⛔ Server error",
        text: "Please try again later."
      });
      console.error(err);
    } finally {
      hideLoader();
    }
  });
}

  window.initAddProjectPage = initAddProjectForm;
// Initialize form submission
// initAddProjectForm();
