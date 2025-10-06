// ---------------Text to Password Toggle------------------
// document.querySelector(".toggle-password").addEventListener("click", function () {
//   const passwordInput = document.getElementById("password");
//   const icon = this.querySelector("i");

//   const isPassword = passwordInput.type === "password";
//   passwordInput.type = isPassword ? "text" : "password";
//   icon.className = isPassword ? "bi bi-eye" : "bi bi-eye-slash";
// });


//--------------------------Signin Loader------------------
function showLoader() {
  document.getElementById("signin-loader").classList.remove("d-none");
}

function hideLoader() {
  document.getElementById("signin-loader").classList.add("d-none");
}


// Auto-focus move to next input
    const pinFields = document.querySelectorAll(".pin-field");

    pinFields.forEach((field, index) => {
      field.addEventListener("input", () => {
        if (field.value.length === 1 && index < pinFields.length - 1) {
          pinFields[index + 1].focus();
        }
      });

      field.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !field.value && index > 0) {
          pinFields[index - 1].focus();
        }
      });
    });


//--------------------------Login Form Submission------------------
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("pin-login-form");
  const pinFields = document.querySelectorAll(".pin-field");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Collect the pin values
      let pin = "";
      pinFields.forEach(field => pin += field.value);

      if (pin.length !== 6) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid PIN',
          text: 'Please enter all 6 digits of your PIN.',
        });
        return;
      }

      showLoader(); // Show loader before making the request

      try {
        const response = await fetch(`/api/v1/auth/signin/${pin}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          window.location.href = "/admin/index.html";
        } else {
          console.error("Login failed:", result.message);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: result.message || 'Invalid PIN',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Server error. Try again later.',
        });
        console.error(err);
      } finally {
        hideLoader(); // Hide loader after processing
      }
    });
  }
});
