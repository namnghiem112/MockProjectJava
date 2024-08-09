const authToken = localStorage.getItem("authToken");
var page = 0;
var totalPages = 0;
var totalElements = 0;
var size = 10;
var search = "";
var rows = "";
var role;
let stt;
const tbody = document.querySelector("table tbody");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "../auth/login.html";
}
document.addEventListener("DOMContentLoaded", () => {
  getListOffer();
  jwtDecode();
  prev.onclick = () => {
    if (page > 0) {
      page--;
      getListOffer();
    }
  };
  next.onclick = () => {
    if (page < totalPages - 1) {
      page++;
      getListOffer();
    }
  };
  roleChecker();
});

function getListOffer() {
  var tableBody = document.querySelector("table tbody");
  console.log(tableBody);
  if (tableBody != null) {
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
  }
  fetch(`http://localhost:8080/api/offers?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      totalElements = data.totalElements;
      totalPages = data.totalPages;
      rows = size * page + data.numberOfElements + "/" + totalElements;
      document.getElementById("rows").innerText = rows;
      data.content.forEach((item) => {
        stt=item.status
        const row = document.createElement("tr");
        if (stt==='CANCELLED'){
          row.innerHTML = `
          <td>${item.candidateOffer.name}</td>
          <td>${item.candidateOffer.email}</td>
          <td>${item.approver.fullname}</td>
          <td>${item.department}</td>
          <td>${item.note}</td>
          <td>${item.status}</td>
          <td>
              <button onclick="viewOfferDetails('${item.id}')">
           <i class="fa-solid fa-eye"></i>
              </button>
          </td>

      `;
        }
        else{
          row.innerHTML = `
          <td>${item.candidateOffer.name}</td>
          <td>${item.candidateOffer.email}</td>
          <td>${item.approver.fullname}</td>
          <td>${item.department}</td>
          <td>${item.note}</td>
          <td>${item.status}</td>
          <td>
              <button onclick="viewOfferDetails('${item.id}')">
           <i class="fa-solid fa-eye"></i>
              </button>
              <button onclick="editOffer('${item.id}')">
              <i class="fa-solid fa-pencil"></i>
                  </button>
          </td>

      `;
        }
  
        tbody.appendChild(row);
      });
      updatePagination();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
function viewOfferDetails(id) {
  window.location.href = `viewdetailoffer.html?id=${id}`;
}

function editOffer(id) {
  window.location.href = `editoffer.html?id=${id}`;
}
function updatePagination() {
  if (page >= totalPages - 1) next.disabled = true;
  else next.disabled = false;

  if (page === 0) prev.disabled = true;
  else prev.disabled = false;
}

function addNewOffer() {
  window.location.href = "newoffer.html";
}

function jwtDecode() {
  const decodedToken = jwt_decode(authToken);
  role = decodedToken.roles;
}

function roleChecker() {
  if (role == "ROLE_recruiter") {
    document.getElementById("add").style.display = "none";
  }
}
async function fetchOffer() {
  const authToken = localStorage.getItem("authToken");
  const response = await fetch(`http://localhost:8080/api/offers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  let size = await response.json();
  const response2 = await fetch(
    `http://localhost:8080/api/offers?size=${size.totalElements}`,
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
  .getElementById("export_offer")
  .addEventListener("click", async function () {
    const offers = await fetchOffer();
    console.log(offers);
    if (offers.length === 0) {
      console.warn("No data available to export.");
      return;
    }
    const data = [];

    // Thêm tiêu đề cột
    const headers = [
      "STT",
      "Candidate Name",
      "Email",
      "Approver",
      "Basic Salary",
      "Contract End",
      "Contract Start",
      "Contract Type",
      "Department",
      "Due Date",
      "Level",
      "Note",
      "Position",
      "Status",
    ];
    data.push(headers);

    // Thêm dữ liệu
    offers.forEach((offer, index) => {
      const rowData = [
        index + 1,
        offer.interview.candidate.name,
        offer.interview.candidate.email,
        offer.approver.fullname,
        offer.basicSalary,
        offer.contractEnd,
        offer.contractStart,
        offer.contractType,
        offer.department,
        offer.dueDate,
        offer.job.level,
        offer.note,
        offer.position,
        offer.status,
      ];
      data.push(rowData);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    const headerStyle = {
      font: {
        bold: true,
        sz: 14,
      },
    };

    headers.forEach((header, index) => {
      const cell_address = XLSX.utils.encode_cell({ c: index, r: 0 });
      if (!ws[cell_address]) ws[cell_address] = { t: "s", v: header };
      ws[cell_address].s = headerStyle;
    });
    XLSX.utils.book_append_sheet(wb, ws, "Offers");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "OffersList.xlsx"; // Tên mặc định của tệp
    link.click();
  });

