let interview_id, recruiter_id, candidate_id;
var role;
const authToken = localStorage.getItem('authToken')
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
  const interviewData = JSON.parse(localStorage.getItem("interviewData"));
  var today = new Date().toISOString().split('T')[0];
  const startInput = document.getElementById('contract_start');
    const endInput = document.getElementById('contract_end');

    startInput.setAttribute('min', today);
    endInput.setAttribute('min', today);

    startInput.addEventListener('change', validateDates);
    endInput.addEventListener('change', validateDates);

    function validateDates() {
        const startDate = startInput.value;
        const endDate = endInput.value;

        if (startDate && endDate) {
            if (startDate > endDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'End date must be after start date!'
                });
                endInput.value = ''; // Reset the end date input field
            }
        }
    }
  document.getElementById('due_date').setAttribute('min', today);
  if (interviewData) {
    console.log(interviewData); // Xử lý dữ liệu hoặc hiển thị trên trang
    // Ví dụ: điền dữ liệu vào form
    document.getElementById("candidate").value = interviewData.candidate.name;
    checkAndProceed(interviewData.candidate.id);
    showInput(".btn-text-levels", interviewData.job.level);
    showManager();
    // document.getElementById("interview_info").value =
    //   interviewData.title +
    //   "\n" +
    //   interviewData.job.title +
    //   "\n" +
    //   interviewData.job.description +
    //   "\nSkills " +
    //   interviewData.job.skill;
    const interviewTitle = interviewData.title;
    const interview = interviewData.interviewers
      .map((interviewer) => interviewer.note)
      .join(", ");
    const jobTitle = interviewData.job.title;
    const interviewResult = interviewData.result;
    const interviewersList = interviewData.interviewers
      .map((interviewer) => interviewer.fullname)
      .join(", ");
    document.getElementById("interview_info").value =
      `Title: ${interviewTitle}` +
      "\n" +
      `Interviewers: ${interviewersList}` +
      "\n" +
      `Result: ${interviewResult}` +
      "\n" +
      `Job: ${jobTitle}`;
    // Tiếp tục điền các trường khác
    document.getElementById("interview_note").value =
    `InterviewNote: ${interviewData.note
        }` +"\n"+
      `InterviewerNote: ${interviewData.interviewerNote
        }` +
      "\n" +
      `Score: ${interviewData.score}` +
      "\n" ;
    document.getElementById("recruiter_owner").value =
      interviewData.recruiter.fullname;
    interview_id = interviewData.id;
    recruiter_id = interviewData.recruiter.id;
    candidate_id = interviewData.candidate.id;
  }
});
//Check if there is any offer associate with candidate or not
async function checkAndProceed(candidateId) {
  const authToken = localStorage.getItem("authToken");
  
  try {
    const response = await fetch(`http://localhost:8080/api/offers/candidate/${candidateId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const offers = await response.json();
      const activeOffers = offers.filter(offer => offer.status !== "CANCELLED");
      if (activeOffers.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Active Offer Exists',
          text: 'Candidate already has an active offer. Redirecting to home page.',
          showConfirmButton: false,
          timer: 5000
        }).then(() => {
          window.location.href = "index.html";
        });
      } else {
        console.log("No existing active offer found. Proceeding to create a new offer.");
      }
    } else {
      console.error("Error checking offers:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
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
  const offer = {
    contractType: document.getElementById("contract_type").value,
    position: document.getElementById("position").value,
    level: sub(".btn-text-levels"),
    contractStart: document.getElementById("contract_start").value,
    contractEnd: document.getElementById("contract_end").value,
    department: document.getElementById("department").value,
    dueDate: document.getElementById("due_date").value,
    basicSalary: salary,
    note: document.getElementById("note").value,
    status: "WAITING_FOR_APPROVAL",
    interview: {
      id: interview_id,
    },
    approver: {
      id: JSON.parse(document.getElementById("approver").value).id,
    },
    recruiter: {
      id: recruiter_id,
    },
    candidateOffer: {
      id: candidate_id,
    },
  };

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
          icon: 'success',
          title: 'Success!',
          text: 'Save thành công'
      }).then(() => {
          localStorage.removeItem('interviewData');
          window.location.href = 'index.html';
      });
  } else {
      console.error("Error saving offer");
    }
  } catch (error) {
    console.error("Error saving offer: ", error);
  }
}

function jwtDecode() {
  const decodedToken = jwt_decode(authToken);
  role = decodedToken.roles;
}
