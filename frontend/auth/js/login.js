document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("authToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("userDepartment", data.department);
          localStorage.setItem("username", data.username);
          localStorage.setItem("id", data.id);
          window.location.href = "../FE_Job_Candidate/index.html";
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("errorMessage").innerText = error.message;
          $("#errorModal").modal("show");
        });
    });
});
