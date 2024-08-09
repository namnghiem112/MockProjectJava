const authToken = localStorage.getItem("authToken");
var role;
var candidates = [];
var positions = [];
var approvers = [];
var interviews = [];
var contractTypes = [];
var level = [];
var departments = [];
const candidateSelection = document.getElementById("candidate");
const positionSelection = document.getElementById("position");
const approverSelection = document.getElementById("approver");
const interviewSelection = document.getElementById("interview");
const contractTypeSelection = document.getElementById("contractType");
const levelSelection = document.getElementById("level");
const departmentSelection = document.getElementById("department");
const recruiter = document.getElementById("recruiter");
const dueDateInput = document.getElementById("dueDate");
const basicSalaryInput = document.getElementById("basicSalary");
const noteInput = document.getElementById("note");
const contractStartInput = document.getElementById("contractStart");
const contractEndInput = document.getElementById("contractEnd");
const submit = document.getElementById("submit");

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "../auth/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  jwtDecode();
  console.log(role);
  if (role == "ROLE_INTERVIEWER"){
    Swal.fire({
      title: 'Error!',
      text: 'You do not have permission to create!',
      icon: 'error',
      confirmButtonText: 'OK'
  }).then((result) => {
      if (result.isConfirmed) {
          history.back();
      }
  });
  }
  fetchDataAndPopulate(
    "candidate",
    "http://localhost:8080/api/candidate/getListCandidate?search=&page=0&size=99999",
    candidateSelection
  );
  fetchDataAndPopulate(
    "position",
    "http://localhost:8080/api/positions",
    positionSelection
  );
  fetchDataAndPopulate(
    "approver",
    "http://localhost:8080/api/users?role=APPROVER&size=99999",
    approverSelection
  );
  fetchDataAndPopulate(
    "interview",
    "http://localhost:8080/api/interviews",
    interviewSelection
  );
  fetchDataAndPopulate(
    "contractType",
    "http://localhost:8080/api/contract-types",
    contractTypeSelection
  );
  fetchDataAndPopulate(
    "level",
    "http://localhost:8080/api/levels",
    levelSelection
  );
  fetchDataAndPopulate(
    "department",
    "http://localhost:8080/api/departments",
    departmentSelection
  );

  dueDateInput.addEventListener("change", validateDueDate);
  contractEndInput.addEventListener("change", validateContractPeriod);
  contractStartInput.addEventListener("change", validateContractPeriod);
});

function fetchDataAndPopulate(type, url, selectionElement) {
  fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Get ${type} error`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let items = data.content || data;
      items.forEach((item) => {
        var option = document.createElement("option");
        option.value = JSON.stringify(item);
        option.text =
          item.name || item.title || `${item.fullname} (${item.username})`;
        selectionElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error(`Error fetching ${type} data:`, error);
    });
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("offerForm"));
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = isValidJSON(value) ? JSON.parse(value) : value;
  });
  console.log(formObject);
  fetch("http://localhost:8080/api/offer/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(formObject),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Offer created successfully!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Can't create offer!");
    });
}

function isValidJSON(value) {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}

function validateDueDate() {
  const dueDate = new Date(dueDateInput.value);
  const today = new Date();

  if (dueDate < today) {
    alert("Due date must be in the future.");
    dueDateInput.value = "";
  }
}

function validateContractPeriod() {
  const contractStart = new Date(contractStartInput.value);
  const contractEnd = new Date(contractEndInput.value);

  if (contractStart && contractEnd && contractEnd <= contractStart) {
    alert("Contract end date must be after the start date.");
    contractEndInput.value = "";
  }
}

function jwtDecode() {
  const decodedToken = jwt_decode(authToken);
  role = decodedToken.roles;
}
