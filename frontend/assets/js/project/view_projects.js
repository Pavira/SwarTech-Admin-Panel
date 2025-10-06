function getStatusBadge(status) {
  switch (status) {
    case "Planned":
      return `<span class="badge bg-info">${status}</span>`;
    case "In Progress":
      return `<span class="badge bg-primary">${status}</span>`;
    case "On Hold":
      return `<span class="badge bg-warning text-dark">${status}</span>`;
    case "Delivered":
      return `<span class="badge bg-success">${status}</span>`;
    case "Cancelled":
      return `<span class="badge bg-danger">${status}</span>`;
    default:
      return `<span class="badge bg-secondary">N/A</span>`;
  }
}

function getCategoryBadge(category) {
  switch (category) {
    case "New Development":
      return `<span class="badge bg-primary ms-2">${category}</span>`;
    case "Maintenance":
      return `<span class="badge bg-info text-dark ms-2">${category}</span>`;
    case "Upgrade":
      return `<span class="badge bg-success ms-2">${category}</span>`;
    default:
      return `<span class="badge bg-secondary ms-2">N/A</span>`;
  }
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";

  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options); // 01 Oct 2025
}

async function fetchProjects() {
  try {
    const response = await fetch(`/api/v1/project/view_projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    // Assuming response is like: { success:true, data:[{project_name, client_name, domain,...}] }
    const projects = result || [];
    
    // Update count
    document.getElementById("project-count").textContent = projects.length;

    // Container
    const container = document.getElementById("projects-container");
    container.innerHTML = ""; // Clear old content

    if (projects.length === 0) {
      container.innerHTML = `<div class="text-center text-muted">No projects found.</div>`;
      return;
    }

    // Create cards dynamically
    projects.forEach((p) => {
      const card = document.createElement("div");
      card.className = "col-md-4 col-lg-3";

      card.innerHTML = `
        <div class="card border shadow-sm h-100 project-card" 
            style="border-radius:12px; font-size:14px; padding:14px;">

            <!-- Header -->
            <div class="card-header d-flex justify-content-between align-items-center rounded-top-3"
                style="background-color:#f0f6ff; border-bottom:1px solid #d0e3ff; font-size:15px; padding:8px 16px;">
              <h5 class="mb-0 fw-bold text-primary" style="font-size:16px;">
                <i class="bi bi-diagram-3-fill me-2"></i> ${p.project_name || "Untitled"}
              </h5>
            <button class="btn btn-sm btn-outline-primary nav-link-load" onclick="loadPage('project/edit_projects', { project_id: '${p.project_id}' })">
              <i class="bi bi-pencil-square"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="card-body bg-white" style="padding:12px 16px;">
            <p class="mb-2">
              <i class="bi bi-person-circle me-2 text-secondary"></i>
              <span class="fw-semibold">Client:</span> ${p.client_name || "-"}
            </p>
            <p class="mb-2">
              <i class="bi bi-building me-2 text-secondary"></i>
              <span class="fw-semibold">Domain:</span>
              <span class="badge bg-danger ms-2">${p.client_industry_type || "N/A"}</span>
            </p>
            <p class="mb-2">
              <i class="bi bi-layers me-2 text-secondary"></i>
              <span class="fw-semibold">Type:</span> ${p.project_type || "-"}, 
              ${getCategoryBadge(p.project_category)}
            </p>
            <p class="mb-2">
              <i class="bi bi-people-fill me-2 text-secondary"></i>
              <span class="fw-semibold">Team:</span> ${p.assigned_team || "N/A"}
            </p>
            <p class="mb-0">
              <i class="bi bi-calendar-event me-2 text-secondary"></i>
              <span class="fw-semibold">Start:</span> ${formatDate(p.project_start_date) || "-"}  
              <span class="fw-semibold ms-3">End:</span> ${formatDate(p.project_end_date) || "-"}
            </p>
          </div>

          <!-- Footer -->
          <div class="card-footer d-flex justify-content-between align-items-center rounded-bottom-3"
              style="background-color:#fafbfc; border-top:1px solid #e0e6eb; font-size:14px; padding:8px 16px;">
            <span class="fw-semibold text-muted">Status:</span>
            ${getStatusBadge(p.project_status)}
          </div>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching projects:", error);
    document.getElementById("projects-container").innerHTML =
      `<div class="text-center text-danger">Error loading projects.</div>`;
  } finally {
    hideLoader();
  }
}

window.initViewProjectsPage = fetchProjects;
