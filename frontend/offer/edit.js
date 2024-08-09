let interview_id, recruiter_id, candidate_id;
const authToken = localStorage.getItem("authToken");
var role;
let offerID = null;
const urlParams = new URLSearchParams(window.location.search);
offerID = urlParams.get("id");
let stt=null;
function editOffer(id) {
  // Lấy token xác thực từ localStorage
  const authToken = localStorage.getItem("authToken");
  jwtDecode();
  console.log(role);
  if (role == "ROLE_INTERVIEWER"){
    Swal.fire({
      title: 'Error!',
      text: 'You do not have permission to edit!',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            history.back();
        }
    });
  }
  fetch(`http://localhost:8080/api/offers/view/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((offer) => {
      console.log(offer);
      stt=offer.status
      const interviewTitle = offer.interview.title;
      const interviewersList = offer.interview.interviewers
        .map((interviewer) => interviewer.interviewerId.fullname)
        .join(", ");
      const interviewResult = offer.interview.result;
      const interview = offer.interview.interviewers
        .map((interviewer) => interviewer.interviewerId.note)
        .join(", ");
      const jobTitle = offer.interview.job.title;
      document.getElementById("offerId").value = offer.id;
      document.getElementById("candidate").value =
        offer.interview.candidate.name;
      showInput(".btn-text-levels", offer.job.level);
      showManager();
      updateSelectValue("approver", offer.approver.fullname);
      updateSelectValue("contract_type", offer.contractType);
      document.getElementById("interview_note").innerText = offer.note;
      document.getElementById("recruiter_owner").value =
        offer.interview.recruiter.fullname;
      document.getElementById("interview_info").value =
        `Title: ${interviewTitle}` +
        "\n" +
        `Interviewers: ${interviewersList}` +
        "\n" +
        `Result: ${interviewResult}` +
        "\n" +
        `Note: ${interview}` +
        "\n" +
        `Job: ${jobTitle}`;
      document.getElementById("position").value = offer.position;
      document.getElementById("contract_start").value = offer.contractStart;
      document.getElementById("contract_end").value = offer.contractEnd;
      document.getElementById("department").value = offer.department;
      document.getElementById("due_date").value = offer.dueDate;
      document.getElementById("salary").value = formatCurrency(offer.basicSalary);
      document.getElementById("note").value = offer.note;
      document.getElementById("interview_id").value = offer.interview.id;
      // document.getElementById("approver_id").value = offer.approver.id;
      console.log(offer.interview.recruiter.id);
      document.getElementById("recruiter_id").value =
        offer.interview.recruiter.id;
      document.getElementById("candidateOffer_id").value =
        offer.candidateOffer.id;
    })
    .catch((error) => console.error("Error fetching offer details: ", error));
}
async function showManager() {
  const authToken = localStorage.getItem("authToken");
  const managerSelection = document.getElementById("approver");
  fetch(`http://localhost:8080/api/user?role=MANAGER&size=99999`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Get Manager error");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const manager = data.content;
      manager.forEach((item) => {
        var option = document.createElement("option");
        option.value = JSON.stringify(item);
        option.text = `${item.fullname} (${item.username})`;
        // console.log(item);
        managerSelection.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
function updateSelectValue(selectId, value) {
  const selectElement = document.getElementById(selectId);
  for (const option of selectElement.options) {
    if (option.value === value) {
      option.selected = true;
      break;
    }
  }
}
// async function showManager(value) {
//   var option = document.createElement("option");
//   option.value = "";
//   option.text = value;
//   const manager = document.getElementById("approver");
//   manager.appendChild(option);
// }
function showInput(class_Name, s) {
  var tmp = "";
  if (class_Name === ".btn-text") {
    tmp = ".item-text";
    document.querySelector(".btn-text").innerText = s.toUpperCase();
  } else if (class_Name === ".btn-text-benefits") {
    tmp = ".item-text-benefits";
    document.querySelector(".btn-text-benefits").innerText = s.toUpperCase();
  } else if (class_Name === ".btn-text-levels") {
    tmp = ".item-text-levels";
    document.querySelector(".btn-text-levels").innerText = s.toUpperCase();
  }
  const data = document.querySelectorAll(tmp);
  data.forEach((item) => {
    if (s.toUpperCase().includes(item.innerText)) {
      item.closest("li").classList.toggle("checked");
    }
  });
}
// Hàm để định dạng tiền tệ
function formatCurrency(amount) {
  const number = parseFloat(String(amount).replace(/[^0-9]/g, ""));
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

// Lắng nghe sự kiện 'input' trên ô nhập liệu
document.getElementById('salary').addEventListener('input', function() {
  const inputValue = this.value;

  // Chuyển đổi giá trị nhập vào thành số và định dạng
  const formattedNumber = formatCurrency(inputValue);
  this.value = formattedNumber;
});

async function saveOffer(event) {
  event.preventDefault();
  const offerId = document.getElementById("offerId").value;
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
      return s.substring(0, s.length - 1).toUpperCase();
    } else {
      return s;
    }
  }
  console.log(document.getElementById("approver").value);
  const salary = document.getElementById("salary").value.replace(/[^0-9]/g, "");
  let offer=null
  if (stt==="REJECTED"){
     offer = {
      contractType: document.getElementById("contract_type").value,
      position: document.getElementById("position").value,
      level: sub(".btn-text-levels"),
      contractStart: document.getElementById("contract_start").value,
      contractEnd: document.getElementById("contract_end").value,
      department: document.getElementById("department").value,
      dueDate: document.getElementById("due_date").value,
      basicSalary: salary,
      note: document.getElementById("interview_note").value,
      status: "WAITING_FOR_APPROVAL",
      interview: {
        id: document.getElementById("interview_id").value,
      },
      approver: {
        id: JSON.parse(document.getElementById("approver").value).id,
      },
      recruiter: {
        id: document.getElementById("recruiter_id").value,
      },
      candidateOffer: {
        id: document.getElementById("candidateOffer_id").value,
      },
    };
  }
  else{
     offer = {
      contractType: document.getElementById("contract_type").value,
      position: document.getElementById("position").value,
      level: sub(".btn-text-levels"),
      contractStart: document.getElementById("contract_start").value,
      contractEnd: document.getElementById("contract_end").value,
      department: document.getElementById("department").value,
      dueDate: document.getElementById("due_date").value,
      basicSalary: salary,
      note: document.getElementById("interview_note").value,
      status: stt,
      interview: {
        id: document.getElementById("interview_id").value,
      },
      approver: {
        id: JSON.parse(document.getElementById("approver").value).id,
      },
      recruiter: {
        id: document.getElementById("recruiter_id").value,
      },
      candidateOffer: {
        id: document.getElementById("candidateOffer_id").value,
      },
    };
  }

  console.log(offer);
  try {
    const method = offerId ? "PUT" : "POST";
    console.log(method);
    const authToken = localStorage.getItem("authToken");
    const url = offerId
      ? `http://localhost:8080/api/offers/update/${offerId}`
      : "http://localhost:8080/api/offers/create";
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(offer),
    });

    if (response.ok) {
      Swal.fire({
        title: 'Success!',
        text: 'Save thành công',
        icon: 'success',
      }).then(() => {
        window.location.href = `index.html`;
      });
      
    } else {
      console.error("Error saving offer");
    }
  } catch (error) {
    console.error("Error saving offer: ", error);
  }
}
document.addEventListener("DOMContentLoaded", editOffer(offerID));


function jwtDecode() {
  const decodedToken = jwt_decode(authToken);
  role = decodedToken.roles;
}