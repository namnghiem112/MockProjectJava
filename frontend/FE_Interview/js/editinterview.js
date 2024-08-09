const authToken = localStorage.getItem('authToken');
var interviewers = [];
var jobs = [];
var candidates = [];
var recruiters = [];
var interviewer;
var role;
var status;
var candidate;
var job;
var recruiter;
var interview;
const interviewerSpan = document.getElementById('interviewers');
const jobSpan = document.getElementById('job');
const recruiterSpan = document.getElementById('recruiter');
const actionButton = document.getElementById('action');
const interviewSelection = document.getElementById('interviewer');
const jobSelection = document.getElementById('job');
const candidateSelection = document.getElementById('candidate');
const recruiterSelection = document.getElementById('recruiter');
const timeStartInput = document.getElementById('timeStart');
const timeEndInput = document.getElementById('timeEnd');
const submit = document.getElementById('submit');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const selectBtn = document.querySelector(".select-btn");
const resultSelection = document.getElementById('result');

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../auth/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) jwtDecode();
    else window.location.href = '../auth/login.html';
    timeStartInput.addEventListener('change', validateTimes);
    timeEndInput.addEventListener('change', validateTimes);
    if (role != "ROLE_INTERVIEWER") {
        selectBtn.addEventListener("click", () => {
            selectBtn.classList.toggle("open");
        });
    }
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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    fetch(`http://localhost:8080/api/interview/get/${id}`, {
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fetch interview error');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            interview = data;
            recruiter = data.recruiter;
            candidate = data.candidate;
            job = data.job;
            interviewers = data.interviewers;
            if (role == "ROLE_INTERVIEWER"){
                var allow = false;
                for (let i = 0; i < data.interviewers.length; i++){
                    if (data.interviewers[i].id == localStorage.getItem('id')){
                        allow = true;
                        break;
                    }
                }
                if (!allow){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: `You're not the interviewer of this interview!`
                    }).then((result) => {
                        if (result.isConfirmed) {
                            history.back();
                        }
                    });
                }
            }
            status = data.status;
            document.getElementById('title').value = data.title;
            document.getElementById('job').value = JSON.stringify(job);
            document.getElementById('candidate').value = JSON.stringify(candidate);
            document.getElementById('recruiter').value = JSON.stringify(recruiter);
            document.getElementById('date').value = data.date;
            document.getElementById('timeStart').value = data.timeStart;
            document.getElementById('timeEnd').value = data.timeEnd;
            document.getElementById('location').value = data.location;
            document.getElementById('status').innerHTML = data.status;
            if (data.note) document.getElementById('note').value = data.note;
            if (data.meetingLink) document.getElementById('meetingLink').value = data.meetingLink;
            if (data.result) document.getElementById('result').value = data.result;
            else document.getElementById('result').value = "";  
            document.getElementById('score').value = data.score;
            document.getElementById('interviewer_note').value = data.interviewerNote;
            const items = Array.from(document.querySelectorAll('.item'));
            // console.log(items);
            items.forEach(item => {
                if (interviewers.some(item1 => JSON.stringify(item1) === item.dataset.item)){
                    item.click();
                }
            });
            // console.log(interviewerSelection);
            // else{ 
                // for (let i = 0; i < interviewSelection.options.length; i++) {
                //     if (interviewer.some(item => JSON.stringify(item) === interviewSelection.options[i].value)) {
                //         interviewSelection.options[i].selected = true;
                //     } else {
                //         interviewSelection.options[i].selected = false;
                //     }
                // }
                // new MultiSelectTag("interviewer");
                
            // }
            if (data.status == "CANCELLED"){
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Cannot edit cancelled interview'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        history.back();
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    
    roleChecker();
});

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
    if (role != "ROLE_INTERVIEWER"){
        const selectedInterviewers = Array.from(document.querySelectorAll('.item.checked')).map(item => {
            return JSON.parse(item.dataset.item);
        });
        const formData = new FormData(document.getElementById('interviewForm'));
        var formObject = {};
        formData.forEach((value, key) => {
            if (isValidJSON(value)) formObject[key] = JSON.parse(value);
            else formObject[key] = value;
        });
        formObject["interviewers"] = selectedInterviewers;
        formObject["id"] = id;
        formObject['result'] = document.getElementById('result').value;
        if (formObject["result"] == "") {
            formObject["result"] = null;
            formObject["status"] = status;
        }
        else formObject["status"] = "INTERVIEWED";
        formObject['interviewerNote'] = document.getElementById('interviewer_note').value;
        formObject['score'] = document.getElementById('score').value;
        console.log(formObject);
        console.log('Selected Interviewers:', selectedInterviewers);
        fetch('http://localhost:8080/api/interview/edit', {
            method: 'PUT',
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
                text: 'Edit successfully!',
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
            // console.log('Success:', data);
            // alert("Edit successfully!");
            roleChecker();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error when edit interview!'
              });
        });
    }
    else {
        const formData = new FormData(document.getElementById('interviewForm'));
        const formObject = {};
        formObject["id"] = id;
        formObject["status"] = "INTERVIEWED";
        formObject["result"] = resultSelection.value;
        formObject["note"] = note.value;
        formObject["score"] = document.getElementById('score').value;
        formObject["interviewerNote"] = document.getElementById('interviewer_note').value;
        formObject["candidate"] = JSON.parse(candidateSelection.value);
        console.log(formObject);
        // console.log('Selected Interviewers:', selectedInterviewers);
        fetch('http://localhost:8080/api/interview/submit', {
            method: 'PUT',
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
                text: 'Submit result successfully!',
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
            // console.log('Success:', data);
            // alert("Submit result successfully!");
            
            
            roleChecker();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error when submit result!'
              });
        });
    }
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

function cancelInterview(){
    if (status != "INTERVIEWED" && status != "CANCELLED"){
        event.preventDefault();
        var selects = document.querySelectorAll('select, option');
        selects.forEach(function(input) {
            input.disabled = false;
        });
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
        formObject["id"] = id;
        if (formObject["result"] === "") {
            formObject["result"] = null;
            formObject["status"] = status;
        }
        else formObject["status"] = "INTERVIEWED";
        formObject["status"] = "CANCELLED";
        // formObject["result"] = null;
        console.log(formObject);
        // alert('test');
        // console.log('Selected Interviewers:', selectedInterviewers);
        fetch('http://localhost:8080/api/interview/edit', {
            method: 'PUT',
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
                text: 'Cancel successfully!',
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
            // console.log('Success:', data);
            // alert("Edit successfully!");
            
            roleChecker();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error when cancel interview!'
              });
        });
    }
    else Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Cannot cancel this interview because it is interviewed or cancelled'
      });
}

function jwtDecode(){
    const decodedToken = jwt_decode(authToken);
    role = decodedToken.roles;
    console.log(role);
}

function roleChecker(){
    if (role == 'ROLE_INTERVIEWER'){
        var inputs = document.querySelectorAll('input');
        inputs.forEach(function(input) {
            input.readOnly = true;
        });
        var selects = document.querySelectorAll('select, option');
        selects.forEach(function(input) {
            input.disabled = true;
        });
        document.getElementById('note').disabled = true;
        // document.getElementById('note').focus();
        document.getElementById('result').disabled = false;
        document.getElementById('score').readOnly = false;
        document.getElementById('interviewer_note').disabled = false;
        document.getElementById('interviewer_note').required = true;
        document.getElementById('result').required = true;
        document.getElementById('score').required = true;
        // document.getElementById('score').focus();
        var resultOptions = document.getElementById('result').options;
        for (var i = 0; i < resultOptions.length; i++) {
            resultOptions[i].disabled = false;
        }
        document.getElementById('cancelInterview').style.display = 'none';
        // while (interviewSelection.firstChild) {
        //     interviewSelection.removeChild(interviewSelection.firstChild);
        // }
    }
    else{
        document.getElementById('interviewer_note').disabled = true;
        document.getElementById('score').disabled = true;
        document.getElementById('excel').hidden = true;
        document.getElementById('excelLabel').hidden = true;
        resultSelection.disabled = true;
    }
}

async function readExcelData(file, worksheet) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    // Access the second worksheet
    const ws = workbook.getWorksheet(worksheet);

    // Read headers and data from the worksheet
    const headers = ws.getRow(2).values; // Assuming the first row contains headers
    const data = [];

    ws.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 2) { // Skip header row
            const rowData = {};
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    rowData[header] = cell.value;
                }
            });
            data.push(rowData);
        }
    });

    // Return the data as JSON
    return data;
}

document.getElementById('excel').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const data = await readExcelData(file, 'Results and Notes');
        console.log(data); // Process the data as needed
        const candidateInfo = await readExcelData(file, 'Candidate Info');
        console.log(candidateInfo);
        const interviewInfo = await readExcelData(file, 'Interview Info');
        console.log(interviewInfo);
        console.log(interview);
        if (id == interviewInfo[0].ID && interview.title === interviewInfo[0].Title){
            if (candidate.id === candidateInfo[0].ID && candidate.name === candidateInfo[0].Name){
                document.getElementById('score').value = data[0].Score;
                document.getElementById('interviewer_note').value = data[0].Note;
                document.getElementById('result').value = data[0].Result;
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `This is not the result form for this candidate!`
                });
                document.getElementById('excel').value = "";
            }
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: `This is not the result form for this interview!`
            });
            document.getElementById('excel').value = "";
        }
        
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Please upload valid result form!`
        });
    }
});

function validateScore(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const value = parseFloat(input.value);

    if (value < min) {
        input.value = min;
    } else if (value > max) {
        input.value = max;
    }
}




