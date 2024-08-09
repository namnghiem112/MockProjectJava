document.addEventListener("DOMContentLoaded", function () {
  var url = new URL(window.location.href);
  var params = new URLSearchParams(url.search);
  getJob(
    params.get("page") ? params.get("page") : 0,
    params.get("title") ? params.get("title") : "",
    params.get("status") ? params.get("status") : ""
  );

  let selectSearchJob = document.getElementById("select_search_job");
  let inputSearchJob = document.getElementById("input_search_job");
  selectSearchJob.value = params.get("status") ? params.get("status") : "all";
  inputSearchJob.value = params.get("title");
});
const btnSearchJob = document.getElementById("btn_search_job");
btnSearchJob.addEventListener("click", async function () {
  let selectSearchJob = document.getElementById("select_search_job");
  let inputSearchJob = document.getElementById("input_search_job");
  let title = inputSearchJob.value || "";
  let status = selectSearchJob.value === "all" ? "" : selectSearchJob.value;
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  params.set("title", title);
  params.set("status", status);
  params.set("page", 0);
  url.search = params.toString();
  window.location.href = url.toString();
});
// function Searching(title, status) {
//   const selectSearchJob = document.getElementById("select_search_job");
//   const inputSearchJob = document.getElementById("input_search_job");
//   title = inputSearchJob.value;
//   status = selectSearchJob.value === "all" ? "" : selectSearchJob.value;
//   return [title, status];
// }
async function getJob(page, title, status) {
  try {
    const authToken = localStorage.getItem("authToken");
    const searchResponse = await fetch(
      `http://localhost:8080/api/job?page=${page}&title=${title}&status=${status}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    let data = await searchResponse.json();
    displayJobs(data.content);
    console.log(data);
    const quantity = document.getElementById("quantity");
    quantity.innerHTML =
      data.content.length + "/" + data.totalElements + " rows";

    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    // btnSearch
    // const btnSearchJob = document.getElementById("btn_search_job");
    // btnSearchJob.addEventListener("click", Searching(title, status));
    const selectSearchJob = document.getElementById("select_search_job");
    const inputSearchJob = document.getElementById("input_search_job");
    title = inputSearchJob.value;
    status = selectSearchJob.value === "all" ? "" : selectSearchJob.value;
    //
    //
    prev.addEventListener("click", function () {
      let url = new URL(window.location.href);
      let params = new URLSearchParams(url.search);
      params.set("page", parseInt(page) - 1);
      // params.set("title", title);
      // params.set("status", status);
      url.search = params.toString();
      window.location.href = url.toString();
    });
    next.addEventListener("click", function () {
      let url = new URL(window.location.href);
      let params = new URLSearchParams(url.search);
      // params.set("title", title);
      // params.set("status", status);
      params.set("page", parseInt(page) + 1);
      url.search = params.toString();
      window.location.href = url.toString();
    });

    if (page == 0) {
      prev.disabled = true;
    }
    if (page == data.totalPages - 1) {
      next.disabled = true;
    }

    // return data;
  } catch (error) {
    console.error("Error fetching job: ", error);
    return null;
  }
}

function displayJobs(jobs) {
  const tbody = document.getElementById("tbody_job");
  tbody.innerHTML = "";
  jobs.forEach((job) => {
    if (job.checked) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${job.title}</td>
                    <td>${job.skill}</td>
                    <td>${job.startDate}</td>
                    <td>${job.endDate}</td>
                    <td>${job.level}</td>
                    <td>${job.status}</td>
                    <td>
                        <button onclick="viewDetailJob(${job.id})">View</button>
                        <button onclick="editJob(${job.id})">Edit</button>
                        <button onclick="showPopUp(${job.id})" class="ban-button">Delete</button>
                    </td>`;
      tbody.appendChild(tr);
    }
  });
}
function showAddJobForm() {
  clear();
  document.getElementById("jobForm").style.display = "block";
  document.getElementById("jobList").style.display = "none";
  document.getElementById("jobDetailForm").style.display = "none";
}
function showViewDetailJobForm() {
  document.getElementById("jobForm").style.display = "none";
  document.getElementById("jobList").style.display = "none";
  document.getElementById("jobDetailForm").style.display = "block";
}
function hideJobForm() {
  document.getElementById("jobForm").style.display = "none";
  document.getElementById("jobDetailForm").style.display = "none";
  document.getElementById("jobList").style.display = "block";
}
function clearSelected(class_Name, li_Class_Name) {
  document.querySelector(class_Name).innerText = "";
  var lis = document.querySelectorAll(li_Class_Name);
  console.log(lis);
  lis.forEach((item) => {
    item.closest("li").classList.remove("checked");
  });
}
function clearSelectedOptions(id) {
  const selectElement = document.getElementById(id);
  const options = selectElement.options;

  for (let i = 0; i < options.length; i++) {
    options[i].selected = false;
  }
}
function clear() {
  document.getElementById("jobId").value = "";
  document.getElementById("title").value = "";
  document.getElementById("start_date").value = "";
  document.getElementById("salary_range_from").value = "";
  document.getElementById("salary_range_to").value = "";
  document.getElementById("working_address").value = "";
  // document.querySelector(".btn-text").innerText = "";
  clearSelected(".btn-text", ".item-text");
  document.getElementById("end_date").value = "";
  // document.querySelector(".btn-text-benefits").innerText = "";
  clearSelected(".btn-text-benefits", ".item-text-benefits");
  // document.querySelector(".btn-text-levels").innerText = "";
  clearSelected(".btn-text-levels", ".item-text-levels");
  document.getElementById("description").value = "";
  clearSelectedOptions("status");
}
async function viewDetailJob(id) {
  try {
    showViewDetailJobForm();
    const authToken = localStorage.getItem("authToken");
    const response = await fetch(`http://localhost:8080/api/job/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const job = await response.json();
    document.getElementById("title_view").innerText = job.title;
    document.getElementById("startDate_view").innerText = job.startDate;
    document.getElementById("endDate_view").innerText = job.endDate;
    document.getElementById("salary_range").innerText =
      job.salaryRangeFrom + " to " + job.salaryRangeTo;
    // document.getElementById("salaryRangeTo").innerText = job.salaryRangeTo;
    document.getElementById("workingAddress_view").innerText =
      job.workingAddress;
    document.getElementById("status_view").innerText = job.status;
    document.getElementById("skill_view").innerText = job.skill;
    document.getElementById("benefits_view").innerText = job.benefits;
    document.getElementById("level_view").innerText = job.level;
    document.getElementById("description_view").innerText = job.description;
    console.log(document.getElementById("description"));
    // return job;
  } catch (error) {
    console.error("Error fetching job: ", error);
    // return null;
  }
  var viewEdit = document.getElementById("view_edit");
  viewEdit.addEventListener("click", function () {
    editJob(id);
  });
}
function chuyen(id, valuesToSelect) {
  const select = document.getElementById(id);
  for (let i = 0; i < select.options.length; i++) {
    const option = select.options[i];
    if (valuesToSelect.toLowerCase().includes(option.value.toLowerCase())) {
      option.selected = true;
      //   document.getElementById(id).defaultSelected = true;
    } else {
      option.selected = false;
    }
  }
}
function showInput(class_Name, s) {
  var tmp = "";
  if (class_Name === ".btn-text") {
    tmp = ".item-text";
    document.querySelector(".btn-text").innerText = s;
  } else if (class_Name === ".btn-text-benefits") {
    tmp = ".item-text-benefits";
    document.querySelector(".btn-text-benefits").innerText = s;
  } else if (class_Name === ".btn-text-levels") {
    tmp = ".item-text-levels";
    document.querySelector(".btn-text-levels").innerText = s;
  }
  const data = document.querySelectorAll(tmp);
  data.forEach((item) => {
    if (s.includes(item.innerText)) {
      item.closest("li").classList.toggle("checked");
    }
  });
}
function editJob(id) {
  showAddJobForm();
  const authToken = localStorage.getItem("authToken");
  fetch(`http://localhost:8080/api/job/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((job) => {
      document.getElementById("jobId").value = job.id;
      document.getElementById("title").value = job.title;
      document.getElementById("start_date").value = job.startDate;
      document.getElementById("salary_range_from").value = job.salaryRangeFrom;
      document.getElementById("salary_range_to").value = job.salaryRangeTo;
      document.getElementById("working_address").value = job.workingAddress;
      chuyen("status", job.status);
      document.getElementById("description").value = job.description;
      job.createdDate = new Date();
      document.getElementById("end_date").value = job.endDate;
      showInput(".btn-text-benefits", job.benefits);
      showInput(".btn-text-levels", job.level);
      showInput(".btn-text", job.skill);
      const ktra = document.getElementById("skills");
    })
    .catch((error) => console.error("Error fetching job details: ", error));
}
function convertDateFormat(dateStr) {
  const dateParts = dateStr.split("/");
  return new Date(dateParts.toString());
}
async function saveJob(event) {
  event.preventDefault();
  const jobId = document.getElementById("jobId").value;
  function sub(item) {
    const element = document.querySelector(item);
    if (!element) {
      console.error(`Element not found for selector: ${item}`);
      return 0;
    }
    const s = element.innerText;
    if (s == null) {
      return 0;
    }
    if (s.length > 1 && s[s.length - 1] === ",") {
      return s.substring(0, s.length - 1);
    } else {
      return s;
    }
  }

  const job = {
    title: document.getElementById("title").value,
    startDate: convertDateFormat(document.getElementById("start_date").value),
    salaryRangeFrom: document
      .getElementById("salary_range_from")
      .value.replaceAll(",", ""),
    salaryRangeTo: document
      .getElementById("salary_range_to")
      .value.replaceAll(",", ""),
    workingAddress: document.getElementById("working_address").value,
    status: document.getElementById("status").value.toUpperCase(),
    skill: sub(".btn-text"),
    endDate: convertDateFormat(document.getElementById("end_date").value),
    benefits: sub(".btn-text-benefits"),
    level: sub(".btn-text-levels"),
    description: document.getElementById("description").value,
    createdDate: new Date(),
    checked: true,
  };
  try {
    if (
      !job.title ||
      !job.startDate ||
      !job.salaryRangeFrom ||
      !job.salaryRangeTo ||
      !job.workingAddress ||
      !job.status ||
      !job.skill ||
      !job.benefits ||
      !job.level ||
      !job.endDate ||
      !job.description
    ) {
      alert("Vui lòng điền tất cả các trường bắt buộc.");
      return;
    }
    if (
      !isNumeric(job.salaryRangeFrom.replace(/,/g, "")) ||
      !isNumeric(job.salaryRangeTo.replace(/,/g, ""))
    ) {
      alert("Vui lòng chọn chọn lại lương không có chữ");
      return;
    } else if (
      isNumeric(job.salaryRangeFrom.replace(/,/g, "")) &&
      isNumeric(job.salaryRangeTo.replace(/,/g, ""))
    ) {
      const salaryFrom = parseFloat(job.salaryRangeFrom.replace(/,/g, ""));
      const salaryTo = parseFloat(job.salaryRangeTo.replace(/,/g, ""));

      if (salaryTo <= salaryFrom) {
        alert("Vui lòng chọn chọn lại lương");
        return;
      }
    }
    // if (job.salaryRangeTo <= job.salaryRangeFrom) {
    //   console.log(job.salaryRangeTo + job.salaryRangeFrom);
    //   alert("Vui lòng chọn chọn lại lương");
    //   return;
    // }
    if (job.startDate > job.endDate) {
      alert("Vui lòng chọn lại ngày");
      return;
    }
    const method = jobId ? "PUT" : "POST";
    console.log(method);
    const authToken = localStorage.getItem("authToken");
    const url = jobId
      ? `http://localhost:8080/api/job/update/${jobId}`
      : "http://localhost:8080/api/job/save";
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(job),
    });

    if (response.ok) {
      hideJobForm();
      location.reload();
    } else {
      console.error("Error saving job");
    }
  } catch (error) {
    console.error("Error saving job: ", error);
  }
}
function showPopUp(id) {
  var modal = document.getElementById("banModal");
  modal.style.display = "block";
  var closeBtn = document.querySelector(".close");
  var cancelBtn = document.querySelector(".cancel-ban");
  function openModal() {
    modal.style.display = "block";
  }
  function closeModal() {
    modal.style.display = "none";
  }
  function outsideClick(e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  }

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  window.addEventListener("click", outsideClick);
  var confirmBtn = document.querySelector(".confirm-ban");
  confirmBtn.addEventListener("click", function () {
    deleteJob(id);
  });
}
async function deleteJob(id) {
  const authToken = localStorage.getItem("authToken");
  await fetch(`http://localhost:8080/api/job/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}
// export
async function fetchJobs() {
  const authToken = localStorage.getItem("authToken");
  const response = await fetch(`http://localhost:8080/api/job`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  let size = await response.json();
  const response2 = await fetch(
    `http://localhost:8080/api/job?size=${size.totalElements}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const data = await response2.json();
  return data.content;
}

document
  .getElementById("export_job")
  .addEventListener("click", async function () {
    const jobs = await fetchJobs();
    console.log(jobs);
    if (jobs.length === 0) {
      console.warn("No data available to export.");
      return;
    }
    const data = [];

    // Thêm tiêu đề cột
    const headers = [
      "STT",
      "Job Title",
      "Required Skills",
      "Start Date",
      "End Date",
      "Level",
      "Benefits",
      "Status",
    ];
    data.push(headers);

    // Thêm dữ liệu với số thứ tự
    jobs.forEach((job, index) => {
      const rowData = [
        index + 1,
        job.title,
        job.skill,
        job.startDate,
        job.endDate,
        job.level,
        job.benefits,
        job.status,
      ];
      data.push(rowData);
    });

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    // Định dạng dòng tiêu đề
    const headerStyle = {
      font: {
        bold: true,
        sz: 20,
      },
    };

    headers.forEach((header, index) => {
      const cell_address = XLSX.utils.encode_cell({ c: index, r: 0 });
      if (!ws[cell_address]) ws[cell_address] = { t: "s", v: header };
      ws[cell_address].s = headerStyle;
    });
    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Jobs");
    // Xuất workbook thành tệp Excel
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Hàm chuyển đổi chuỗi thành array buffer
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }

    // Tạo một Blob từ array buffer và tạo link tải xuống
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "JobList.xlsx"; // Tên mặc định của tệp
    link.click();
  });
// salary
document
  .getElementById("salary_range_from")
  .addEventListener("input", formatInput);
document
  .getElementById("salary_range_to")
  .addEventListener("input", formatInput);

function formatInput(event) {
  const input = event.target;
  let value = input.value.replace(/,/g, ""); // Loại bỏ dấu phẩy hiện tại

  if (!isNaN(value) && value !== "") {
    input.value = formatNumber(value);
  }
}

function formatNumber(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function isNumeric(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}

// auth
let token = localStorage.getItem("authToken");
let uslg = localStorage.getItem("username");

function logout() {
  fetch("http://localhost:8080/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ username: uslg }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
      localStorage.removeItem("userDepartment");
      window.location.href = "/auth/login.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const department = localStorage.getItem("userDepartment");
  const usernameSpan = document.querySelector(".us");
  const departmentSpan = document.querySelector(".dp");
  usernameSpan.innerHTML = `<i class="fa-solid fa-user"></i> ${
    username || "Guest"
  }`;
  departmentSpan.innerHTML = `<i class="fa-solid fa-building"></i> ${
    department || "N/A"
  }`;
});
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const department = localStorage.getItem("userDepartment");
  const usernameSpan = document.querySelector(".us1");
  const departmentSpan = document.querySelector(".dp1");
  usernameSpan.innerHTML = `<i class="fa-solid fa-user"></i> ${
    username || "Guest"
  }`;
  departmentSpan.innerHTML = `<i class="fa-solid fa-building"></i> ${
    department || "N/A"
  }`;
});
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const department = localStorage.getItem("userDepartment");
  const usernameSpan = document.querySelector(".us2");
  const departmentSpan = document.querySelector(".dp2");
  usernameSpan.innerHTML = `<i class="fa-solid fa-user"></i> ${
    username || "Guest"
  }`;
  departmentSpan.innerHTML = `<i class="fa-solid fa-building"></i> ${
    department || "N/A"
  }`;
});
