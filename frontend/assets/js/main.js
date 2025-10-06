// Load reusable components (navbar, sidebar, footer)
function loadComponent(id, path) {
  fetch(`/admin/components/${path}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}

// Global variable to hold page parameters
window.pageParams = {};
window.appHistory = window.appHistory || [];
// Load a page into the main content area
function loadPage(relativePath, params = {}) {
  console.log("Loading page:", relativePath); // Add this

  window.pageParams = params; // Save params globally
  window.currentPage = relativePath; // ✅ set after push

  fetch(`/admin/pages/${relativePath}.html`)
    .then(res => res.text())
    .then(html => {
      const pageBody = document.getElementById("page-body");
      if (pageBody) {
        pageBody.innerHTML = html;
      }

      const pageKey = relativePath.split("/")[0];  // just 'dashboard' or 'patients'

      highlightActiveNav(relativePath);
      setHeaderFromMetadataOrMap(relativePath, pageKey);

      //-------------------------View project scripts--------------------------
      if (relativePath === "project/view_projects") {
        loadScriptOnce("/admin/assets/js/project/view_projects.js", () => {
        if (typeof initViewProjectsPage === "function") {
            fetchProjects(); // ✅ Safe call
          }
        });
      }
      // -------------------------Add project scripts-------------------------
      if (relativePath === "project/add_projects") {
        // loadStyleOnce("admin/assets/css/drugs/add_drugs.css"); 
        loadScriptOnce("/admin/assets/js/project/add_projects.js", () => {
          if (typeof initAddProjectPage === "function") {
            initAddProjectForm(); // ✅ Safe call
          }
        });
      }

      if (relativePath === "project/edit_projects") {
        // loadStyleOnce("admin/assets/css/drugs/edit_drugs.css");
        loadScriptOnce("/admin/assets/js/project/edit_projects.js", () => {
          if (typeof initEditProjectPage === "function") {
            initEditProjectPage(); // ✅ Safe call
          }
        });
      }
    });
}

// Highlight the active link in sidebar
function highlightActiveNav(pagePath) {
  const navLinks = document.querySelectorAll("#sidebar .nav-link");
  navLinks.forEach(link => link.classList.remove("active"));

  const navId = "nav-" + pagePath.replace(/\//g, "-");
  const activeLink = document.getElementById(navId);
  if (activeLink) activeLink.classList.add("active");
}

// Handle both default page header map and custom page metadata
function setHeaderFromMetadataOrMap(path, key) {
  // alert("Setting header for path: " + path); // Debugging line
  const meta = document.getElementById("page-header-data");
  if (meta) {
    // Custom page-level metadata (like add_patient)
    // console.log("Using custom metadata for header:", meta);
    const icon = meta.dataset.icon || "file-earmark-text";
    const title = meta.dataset.title || "Untitled Page";
    const subtitle = meta.dataset.subtitle || "";
    setPageHeader(icon, title, subtitle);
  } else {
    // Use predefined map
    // updatePageHeader(key);
  }
}

// Render page header
function setPageHeader(icon, title, subtitle = "",bgImage = "") {
  const header = document.getElementById("page-header");
  // console.log("Setting page header with icon: " + icon + ", title: " + title); // Debugging line
  if (header) {
  //   const backgroundStyle = bgImage
  //     ? `style="
  //     background-image: url('${bgImage}');
  //     background-size: contain;              /* smaller image */
  //     background-position: right center;      /* shift to left */
  //     background-repeat: no-repeat;
  //     border-radius: 10px;
  //     padding: 0;          /* extra left padding to make room for image */
  //     min-height: 80px;"`                   /* control height */
  // : "";

    header.innerHTML = `
      <div>
        <h3 class="mb-1 d-flex align-items-center">
          <i class="bi bi-${icon} me-2 fs-4"></i> ${title}
        </h3>
        ${subtitle ? `<p class="text-muted small mb-0 ms-4">${subtitle}</p>` : ""}
      </div>
    `;
  }
}


// Add this global click handler in main.js
document.addEventListener("click", function (e) {
  const target = e.target.closest(".nav-link-load");
  if (target) {
    e.preventDefault();
    const page = target.getAttribute("data-page");
    // console.log("Clicked page:", page);
    if (page) {
      loadPage(page);
    }
  }
});

function loadScriptOnce(src, callback) {
  console.log("Loading script:", src);
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) existing.remove(); // Remove old one

  const script = document.createElement("script");
  script.src = src;
  script.defer = true; // <-- Ensures execution after DOM is parsed
  script.onload = () => {
    console.log("Script reloaded:", src);
    if (callback) callback();
  };
  script.onerror = () => {
    console.error("Failed to reload:", src);
  };
  document.body.appendChild(script);
}



// Load styles only for particular pages
function loadStyleOnce(href) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}

function loadLayoutComponents() {
  loadComponent("navbar", "navbar.html");
  // loadComponent("sidebar", "sidebar.html");
  loadComponent("footer", "footer.html");

  const pageHeader = document.getElementById("page-header");
  if (!pageHeader) {
    const headerDiv = document.createElement("div");
    headerDiv.id = "page-header";
    headerDiv.className = "page-header d-flex justify-content-between align-items-center mb-3";
    document.getElementById("main-content").prepend(headerDiv);
  }
}


//---------Loader Functionality---------
function showLoader() {
  document.getElementById("global-loader").classList.remove("d-none");
}

function hideLoader() {
  document.getElementById("global-loader").classList.add("d-none");
}

// On page load
window.onload = () => {
  loadLayoutComponents();
  loadPage("project/view_projects");
};
