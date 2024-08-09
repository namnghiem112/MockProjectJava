document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const jobId = document.getElementById("upload_jobId").value;
    console.log(jobId);
    const fileInput = document.getElementById("cvFile");
    const formData = new FormData();

    formData.append("jobId", jobId);
    formData.append("cvFile", fileInput.files[0]);
    const authToken = localStorage.getItem("authToken");

    fetch("http://localhost:8080/api/upload/upload-cv", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          alert("CV uploaded successfully!");
          window.location.href = "index.html";
        } else {
          alert("Failed to upload CV.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error uploading CV.");
      });
  });
