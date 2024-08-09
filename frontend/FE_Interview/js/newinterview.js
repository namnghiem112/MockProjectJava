const authToken = localStorage.getItem('authToken');
var role;
var interviewers = [];
var jobs = [];
var candidates = [];
var recruiters = [];
const interviewSelection = document.getElementById('interviewer');
const jobSelection = document.getElementById('job');
const candidateSelection = document.getElementById('candidate');
const recruiterSelection = document.getElementById('recruiter');
const timeStartInput = document.getElementById('timeStart');
const timeEndInput = document.getElementById('timeEnd');
const submit = document.getElementById('submit');
const selectBtn = document.querySelector(".select-btn");
const params = getURLParams();

selectBtn.addEventListener("click", () => {
  selectBtn.classList.toggle("open");
});

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../auth/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) jwtDecode();
    else window.location.href = '../auth/login.html';
    if (role == "ROLE_INTERVIEWER"){
        alert("You don't have permission to add new interview!");
        window.location.href = "index.html";
    }
    timeStartInput.addEventListener('change', validateTimes);
    timeEndInput.addEventListener('change', validateTimes);
    fetchInterviewer();
    fetchJob();
    fetchCandidate();
    fetchRecruiter();
    document.getElementById('searchInput').addEventListener('input', function() {
        var filter = this.value.toLowerCase();
        var listItems = document.getElementById('listItems').getElementsByTagName('li');
        for (var i = 0; i < listItems.length; i++) {
            var text = listItems[i].textContent || listItems[i].innerText;
            if (text.toLowerCase().indexOf(filter) > -1) {
            listItems[i].style.display = "";
            } else {
            listItems[i].style.display = "none";
            }
        }
    });
});

function fetchRecruiter(){
    fetch(`http://localhost:8080/api/user?role=RECRUITER&size=99999`, {
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Get recruiters error');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            recruiters = data.content;
            recruiters.forEach(item => {
                var option = document.createElement('option');
                option.value = JSON.stringify(item);
                option.text = `${item.fullname} (${item.username})`;
                // console.log(item);
                recruiterSelection.appendChild(option);
            });
            if (params.recruiterId){
                const options = recruiterSelection.options;
                for (let i = 0; i < options.length; i++) {
                    const optionValue = JSON.parse(options[i].value);
                    if (optionValue.id == params.recruiterId) {
                        recruiterSelection.selectedIndex = i;
                        break;
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function fetchJob(){
    fetch(`http://localhost:8080/api/job?size=99999`, {
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Get Job error');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            jobs = data.content;
            jobs.forEach(item => {
                var option = document.createElement('option');
                option.value = JSON.stringify(item);
                option.text = item.title;
                // console.log(item);
                if (item.status != "OPEN") option.hidden = true;
                jobSelection.appendChild(option);
            });
            if (params.jobId){
                const options = jobSelection.options;
                for (let i = 0; i < options.length; i++) {
                    const optionValue = JSON.parse(options[i].value);
                    if (optionValue.id == params.jobId) {
                        jobSelection.selectedIndex = i;
                        break;
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function fetchInterviewer(){
    fetch(`http://localhost:8080/api/user?role=INTERVIEWER&size=99999`, {
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Get interviewers error');
            }
            return response.json();
        })
        .then(data => populateList(data))
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function fetchCandidate(){
    fetch(`http://localhost:8080/api/candidate/getListCandidate?search=&page=0&size=99999`, {
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Get candidates error');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            candidates = data.content;
            candidates.forEach(item => {
                var option = document.createElement('option');
                option.value = JSON.stringify(item);
                option.text = item.name;
                // console.log(item);
                candidateSelection.appendChild(option);
            });
            if (params.candidateId){
                const options = candidateSelection.options;
                // console.log(options);
                for (let i = 0; i < options.length; i++) {
                    const optionValue = JSON.parse(options[i].value);
                    // console.log(JSON.parse(options[i].value));
                    if (optionValue.id == params.candidateId) {
                        candidateSelection.selectedIndex = i;
                        break;
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function populateList(data) {
    const listItemsContainer = document.getElementById('listItems');
    listItemsContainer.innerHTML = ''; // Clear any existing items
    var interviewers = data.content;
    interviewers.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item';
      li.dataset.item = JSON.stringify(item);
      li.innerHTML = `
        <span class="checkbox">
          <i class="fa-solid fa-check check-icon"></i>
        </span>
        <span class="item-text">${item.fullname} (${item.username})</span>
      `;
      listItemsContainer.appendChild(li);
    });
    const items = document.querySelectorAll(".item");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("checked");
    
        let checked = document.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text");
        const texts = document.querySelectorAll(".checked .item-text");
        btnText.innerText = "";
        if (checked && checked.length > 0) {
          texts.forEach((item) => {
            var tmp = btnText.innerText;
            if (tmp != "") tmp += ", "; 
            tmp += item.innerText;
            btnText.innerText = tmp;
          });
        } else {
          btnText.innerText = "";
        }
      });
    });
  }

function handleSubmit(event){
    event.preventDefault();
    const selectedInterviewers = Array.from(document.querySelectorAll('.item.checked')).map(item => {
        return JSON.parse(item.dataset.item);
    });
    const formData = new FormData(document.getElementById('interviewForm'));
    const formObject = {};
    formData.forEach((value, key) => {
        if (isValidJSON(value)) formObject[key] = JSON.parse(value);
        else formObject[key] = value;
    });
    formObject["interviewers"] = selectedInterviewers;
    formObject["result"] = null;
    formObject["status"] = "NEW";
    console.log(formObject);
    // alert('test');
    // console.log('Selected Interviewers:', selectedInterviewers);
    fetch('http://localhost:8080/api/interview/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formObject)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: errorData.message
                  });
            });
        }
        else Swal.fire({
            title: 'Success!',
            text: 'Create interview successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                history.back();
            }
        });
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error when edit interview!'
          });
    });

    // fetch('http://localhost:8080/api/interview/create/email', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${authToken}`
    //     },
    //     body: JSON.stringify(formObject)
    // })
    // .then(response => {
    //     if (!response.ok) console.log("Send email error!");
    //     else console.log("Send email success!");
    // })
}

function isValidJSON(value) {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
}

function validateTimes() {
    const startTime = timeStartInput.value;
    const endTime = timeEndInput.value;

    if (startTime && endTime && endTime <= startTime) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'End time must be greater than start time!'
          });
      timeEndInput.value = '';
    }
  }

function jwtDecode(){
    const decodedToken = jwt_decode(authToken);
    role = decodedToken.roles;
}

function getURLParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

