const authToken = localStorage.getItem("authToken");
var page = 0;
var totalPages = 0;
var totalElements = 0;
var size = 10;
var search = "";
var rows = "";
var interviewerId = 0;
var status = "";
var role;
var eventList = [];
const tbody = document.getElementById("tbody");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const interviewerSelection = document.getElementById("interviewer");
const statusSelection = document.getElementById("status");

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "../auth/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (authToken) jwtDecode();
  else window.location.href = "../auth/login.html";
  getListInterview();
  getListInterviewer();
  prev.onclick = () => {
    if (page > 0) {
      page--;
      getListInterview();
    }
  };
  next.onclick = () => {
    if (page < totalPages - 1) {
      page++;
      getListInterview();
    }
  };
  roleChecker();
});

function getListInterviewer() {
  fetch(`http://localhost:8080/api/user?role=INTERVIEWER&size=99999`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Get interviewers error");
      }
      return response.json();
    })
    .then((data) => {
      const interviewers = data.content;
      interviewers.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = `${item.fullname} (${item.username})`;
        // console.log(item);
        interviewerSelection.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getListInterview() {
  var tableBody = document.getElementById("tbody");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  var url = `http://localhost:8080/api/interview/get?page=${page}&size=${size}`;
  if (search != "") url += `&search=${search}`;
  if (status != "") url += `&status=${status}`;
  if (interviewerId > 0) url += `&interviewerId=${interviewerId}`;
  fetch(url, {
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
      console.log(data);
      totalElements = data.totalElements;
      totalPages = data.totalPages;
      if (totalElements == 0) page--;
      rows = `Page ${page + 1} of ${totalPages}`;
      document.getElementById("rows").innerText = rows;
      tbody.innerHTML = "";
      data.content.forEach((item) => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.style.width = "150px";
        titleCell.textContent = item.title;

        const candidateCell = document.createElement("td");
        candidateCell.style.width = "160px";
        candidateCell.textContent = item.candidate.name;

        const interviewersCell = document.createElement("td");
        interviewersCell.style.width = "120px";
        interviewersCell.textContent = item.interviewers.map(interviewer => interviewer.fullname).join(", ");

        const dateCell = document.createElement("td");
        dateCell.style.width = "150px";
        dateCell.textContent = `${item.date} ${convertTime(item.timeStart)} - ${convertTime(item.timeEnd)}`;

        const resultCell = document.createElement("td");
        resultCell.style.width = "70px";
        resultCell.textContent = item.result || "N/A";

        const statusCell = document.createElement("td");
        statusCell.style.width = "100px";
        statusCell.textContent = item.status;

        const jobTitleCell = document.createElement("td");
        jobTitleCell.style.width = "150px";
        jobTitleCell.textContent = item.job.title;

        const actionsCell = document.createElement("td");
        actionsCell.style.width = "150px";
        actionsCell.innerHTML = `
            <button><a href="viewdetailinterview.html?id=${item.id}" style="text-decoration: none; color: black">View</a></button>
            <button><a href="editinterview.html?id=${item.id}" style="text-decoration: none; color: black">Edit</a></button>
            ${item.result === "PASSED" && item.status === "INTERVIEWED" ? `<button onclick="newOffer(${item.id})">Add Offer</button>` : ""}
        `;

        // Append cells to the row
        row.appendChild(titleCell);
        row.appendChild(candidateCell);
        row.appendChild(interviewersCell);
        row.appendChild(dateCell);
        row.appendChild(resultCell);
        row.appendChild(statusCell);
        row.appendChild(jobTitleCell);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    
        // Add hover functionality to each cell
        [candidateCell, interviewersCell, jobTitleCell].forEach((cell, index) => {
            cell.addEventListener('mouseenter', (event) => {
                const infoBox = document.getElementById('info-box');
                let infoContent = '';
    
                switch (index) {
                    case 0:
                        infoContent = `
                    <span>Email: ${item.candidate.email}</span>
                    </br>
                    <span>Skills: ${item.candidate.skill}</span>
                    </br>
                    <span>Year of experience: ${item.candidate.exp}</span>
                    `;
                        break;
                    case 1:
                        infoContent = `Interviewers: ${item.interviewers.map(interviewer => interviewer.fullname).join(", ")}`;
                        break;
                    case 2:
                        infoContent = `
                    <span>Level: ${item.job.level}</span>
                    </br>
                    <span>Status: ${item.job.status}</span>
                    </br>
                    <span>Working address: ${item.job.workingAddress}</span>
                    `;
                        break;
                }
    
                infoBox.innerHTML = infoContent;
                infoBox.style.display = 'block';
                infoBox.style.left = `${event.pageX + 10}px`;
                infoBox.style.top = `${event.pageY + 10}px`;
            });
    
            cell.addEventListener('mouseleave', () => {
                const infoBox = document.getElementById('info-box');
                infoBox.style.display = 'none';
            });
        });
    
        tbody.appendChild(row);
    });
      prev.disabled = page === 0;
      next.disabled = page === totalPages - 1;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function addNewInterview() {
  window.location.href = "newinterview.html";
}

function jwtDecode() {
  const decodedToken = jwt_decode(authToken);
  role = decodedToken.roles;
}

function roleChecker() {
  if (role == "ROLE_INTERVIEWER") {
    document.getElementById("add").style.display = "none";
    document.getElementById("showCalendar").hidden = false;
    calendarInit();
  }
  else{
    var calendarEl = document.getElementById('calendar');
    calendarEl.style.display = 'none';
  }
}

function handleSearch() {
  page = 0;
  status = statusSelection.value;
  interviewerId = interviewerSelection.value;
  search = document.getElementById("search").value.trim();
  getListInterview();
}
async function newOffer(id) {
  const authToken = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `http://localhost:8080/api/interview/get/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    console.log(data);
    localStorage.setItem("interviewData", JSON.stringify(data));
    window.location.href = `../offer/newoffer.html?id=${id}`;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function calendarInit() {
  var calendarEl = document.getElementById('calendar');
  getInterviewSchedule().then(() => { // Wait for fetching to complete
    console.log(eventList);
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      events: eventList,
      eventClick: function(info) {
        window.location.href = `viewdetailinterview.html?id=${info.event.id}`;
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      dayHeaderFormat: {
        day: '2-digit',
        month: '2-digit',
        year: undefined 
      }
    });
    calendar.render();
    calendarEl.style.display = 'none';
    // document.getElementById('showCalendar').addEventListener('click', function() {
    //   if (calendarEl.style.display === 'none') {
    //     calendarEl.style.display = 'flex';
    //     this.textContent = 'Hide Calendar';
    //   } else {
    //     calendarEl.style.display = 'none';
    //     this.textContent = 'Show Calendar';
    //   }
    // });

    document.getElementById('showCalendar').addEventListener('click', function() {
      if (calendarEl.style.display === 'none') {
        calendarEl.style.display = 'flex';
        this.textContent = 'Hide Calendar';
      } else {
        calendarEl.style.display = 'none';
        this.textContent = 'Show Calendar';
      }
    });
  });
  
}

function getInterviewSchedule() {
  var fetchPromises = []; // Array to store fetch promises

  const statuses = ['NEW', 'INVITED', 'REMINDED'];
  statuses.forEach(status => {
    fetchPromises.push(
      fetch(`http://localhost:8080/api/interview/get?page=0&size=99999&interviewerId=${localStorage.getItem("id")}&status=${status}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      })
      .then(response => response.json())
      .then(data => {
        var interviews = data.content;
        interviews.forEach((item) => {
          eventList.push({
            id: item.id,
            title: `${item.title} - ${item.job.title}`,
            start: `${item.date}T${item.timeStart}`,
            end: `${item.date}T${item.timeEnd}`,
          });
        });
      })
    );
  });

  // Return a promise that resolves when all fetches are complete
  return Promise.all(fetchPromises);
}

function convertTime(time) {
  // Split the input time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = time.split(':');

  // Return the time in HH:mm format
  return `${hours}:${minutes}`;
}
