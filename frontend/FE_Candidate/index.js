let page = 0;
var totalPages = 0;
var totalElements = 0;
var size = 10;
var search = "";
var rows = "";
var jobIds = [];
const authToken = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
    const statusSelect = document.getElementById('statusSelect');
    statusSelect.addEventListener('change', statusFilter);
    getCandidate();
});

async function getCandidate() {
    try {
        const API_ENDPOINT =
            "http://localhost:8080/api/candidate/getListCandidate?search=" +
            search +
            "&page=" +
            page +
            "&size=" +
            size;
        const searchResponse = await fetch(API_ENDPOINT, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
        });
        let data = await searchResponse.json();
        displayCandidate(data.content);
        console.log(data);
        const quantity = document.getElementById("quantity");
        quantity.innerHTML =
            data.pageable.pageNumber + "/" + data.totalPages + " rows";
        page = data.pageable.pageNumber;
        totalPages = data.totalPages;
        updatePaginationControls();
        // return data;
    } catch (error) {
        console.error("Error fetching job: ", error);
        return null;
    }
}
document.getElementById("cvEdit").addEventListener("change", function() {
    const cvInput = document.getElementById("cvEdit");
    const cvFileName = document.getElementById("cvFileName");
    if (cvInput.files.length > 0) {
        cvFileName.innerText = cvInput.files[0].name;
    }
});
function updatePaginationControls() {
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    // Remove previous event listeners
    prev.replaceWith(prev.cloneNode(true));
    next.replaceWith(next.cloneNode(true));

    const newPrev = document.getElementById("prev");
    const newNext = document.getElementById("next");

    newPrev.disabled = page === 0;
    newNext.disabled = page === totalPages - 1;

    newPrev.addEventListener("click", function () {
        if (page > 0) {
            page--;
            getCandidate();
        }
    });

    newNext.addEventListener("click", function () {
        if (page < totalPages - 1) {
            page++;
            getCandidate();
        }
    });
}

function displayCandidate(datas) {
    const tbody = document.getElementById("tbody_candidate");
    tbody.innerHTML = "";
    datas.forEach((data) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>
                            <span class="expand-button">▼</span>
                            ${data.name}
                        </td>
                      <td>${data.email}</td>
                      <td>${data.phone}</td>
                      <td>${data.position}</td>
                      <td>${data.recruitercad.fullname}</td>
                      <td>${data.status}</td>
                        <td>
                        <button onclick="view(${data.id})">View</button>
                        <button onclick="editCandidate(${data.id})">Edit</button>
                        <button onclick="showPopUp(${data.id})" class="ban-button">Delete</button>
                        </td>
                      `;
        tbody.appendChild(tr);

        const jobRows = [];
        let hasOpenJob = false;
        const nestedTable = document.createElement("tr");
        nestedTable.classList.add('expandable-content');
        nestedTable.innerHTML = `<td colspan="7" style="padding: 0;">
                                    <table class="nested-table" style="width: 100%;">
                                        <thead>
                                          <tr>
                                              <th style="width: 170px;">Job Title</th>
                                              <th style="width: 150px;">Required Skills</th>
                                              <th style="width: 130px;">Level</th>
                                              <th style="width: 150px;">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </td>`;
        const nestedTableBody = nestedTable.querySelector('.nested-table tbody');
        data.job.forEach((job) => {
            if (job.status === "OPEN") {
                hasOpenJob = true;
                const jobRow = document.createElement("tr");
                jobRow.innerHTML = `<td>${job.title}</td>
                                    <td>${job.skill}</td>
                                    <td>${job.level}</td>
                                    <td><button onclick='createInterview(${data.id}, ${job.id}, ${data.recruitercad.id})'>Create interview</button></td>`;
                nestedTableBody.appendChild(jobRow);
            }
        });

        if (hasOpenJob) {
            tbody.appendChild(nestedTable);
            jobRows.push(nestedTable);
        }

        const expandButton = tr.querySelector('.expand-button');
        if (!hasOpenJob) {
            expandButton.classList.add('disabled');
        } else {
            expandButton.addEventListener('click', function () {
                if (tr.classList.contains('expanded')) {
                    tr.classList.remove('expanded');
                    jobRows.forEach(jobRow => jobRow.style.display = 'none');
                    expandButton.classList.remove('collapsed'); // Rotate back to ▼
                } else {
                    tr.classList.add('expanded');
                    jobRows.forEach(jobRow => jobRow.style.display = 'table-row');
                    expandButton.classList.add('collapsed'); // Rotate to ▲
                }
            });
        }
    });
}

function createInterview(candidateId, jobId, recruiterId) {
    const params = new URLSearchParams({
        candidateId: candidateId,
        jobId: jobId,
        recruiterId: recruiterId
    });
    const newUrl = `../FE_Interview/newinterview.html?${params.toString()}`;
    window.location.href = newUrl;
}

async function view(id) {
    try {
        showForm();
        const response = await fetch(
            `http://localhost:8080/api/candidate/getDetailCandidate/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            }
        );
        const candidate = await response.json();
        document.getElementById("personname").innerText = candidate.name;
        document.getElementById("dobDetail").innerText = candidate.dob;
        document.getElementById("phoneDetail").innerText = candidate.phone;
        document.getElementById("emailDetail").innerText = candidate.email;
        document.getElementById("addressDetail").innerText = candidate.address;
        document.getElementById("positionDetail").innerText = candidate.position;
        document.getElementById("genderDetail").innerText = candidate.gender;
        document.getElementById("cvDetail").innerText = candidate.cv;
        const jobTitles = candidate.job.map(pos => pos.title).join(', ');
        document.getElementById("jobDetail").innerText = jobTitles;
        document.getElementById("skillDetail").innerText = candidate.skill;
        document.getElementById("recruiterDetail").innerText =
            candidate.recruitercad.fullname;
        document.getElementById("noteDetail").innerText = candidate.note;
        document.getElementById("statusDetail").innerText = candidate.status;
        document.getElementById("experienceDetail").innerText = candidate.exp;
        document.getElementById("levelDetail").innerText = candidate.highestLevel;
        document.getElementById("idDetail").value = candidate.id;

        if (candidate.status != "BANNED") {
            document.getElementById("statusCandidate").innerText = "Ban Candidate";
        } else {
            document.getElementById("statusCandidate").innerText = "Open Candidate";
        }

        const editButton = document.getElementById("editButton");
        editButton.onclick = function () {
            editCandidate(candidate.id);
        };
    } catch (error) {
        console.error("Error fetching candidate: ", error);
        // return null;
    }
}
function handleDownloadDetail(event){
    event.preventDefault();
    var fileName = document.getElementById('cvDetail').innerText;
    fetch(`http://localhost:8080/api/upload/cv/file/${encodeURIComponent(fileName)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('File not found');
        }
        // Get the content type from the response headers
        const contentType = response.headers.get('content-type');
        return response.blob().then(blob => ({blob, contentType}));
    })
    .then(({blob, contentType}) => {
        // Create a blob with the correct content type
        const file = new Blob([blob], { type: contentType });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error appropriately in your UI
    });
}
function showForm() {
    document.getElementById("addCandidateForm").style.display = "none";
    document.getElementById("candidateList").style.display = "none";
    document.getElementById("candidateForm").style.display = "block";
    document.getElementById("editCandidateForm").style.display = "none";
}

function hideForm() {
    document.getElementById("addCandidateForm").style.display = "none";
    document.getElementById("candidateForm").style.display = "none";
    document.getElementById("candidateList").style.display = "block";
    document.getElementById("editCandidateForm").style.display = "none";
}

async function showAddForm() {
    document.getElementById("addCandidateForm").style.display = "block";
    document.getElementById("candidateForm").style.display = "none";
    document.getElementById("candidateList").style.display = "none";
    document.getElementById("editCandidateForm").style.display = "none";
    try {
        const API_ENDPOINT = "http://localhost:8080/api/user?role=RECRUITER";
        const searchResponse = await fetch(API_ENDPOINT, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
        });
        const responseJson = await searchResponse.json();
        const datas = responseJson.content;
        const recruiterSelect = document.getElementById("recruiter");
        recruiterSelect.innerHTML = "<option >Select a recruiter</option>";

        datas.forEach((data) => {
            const option = document.createElement("option");
            option.value = data.id;
            option.textContent = data.fullname;
            recruiterSelect.appendChild(option);
        });


        const API_JOB = "http://localhost:8080/api/job?status=OPEN"
        const res = await fetch(API_JOB, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
        });
        const resJson = await res.json();
        const datasJob = resJson.content;

        const jobSelect = document.getElementById("jobAdd");
        jobSelect.innerHTML = "";

        datasJob.forEach((data) => {
            const div = document.createElement('div');
            div.className = "custom-control custom-checkbox m-2";

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = data.id;
            input.name = 'job';
            input.value = data.id;
            input.className = 'custom-control-input';

            const label = document.createElement('label');
            label.className = 'custom-control-label';
            label.htmlFor = data.id;
            label.textContent = data.title;

            div.appendChild(input);
            div.appendChild(label);
            jobSelect.appendChild(div);
        });

        const API_CV = "http://localhost:8080/api/upload/cv/files"
        const cvRes = await fetch(API_CV, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });
        const cvFiles = await cvRes.json();
        const fileSelect = document.getElementById('fileSelect');
        fileSelect.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "...";
        fileSelect.appendChild(option);
        cvFiles.forEach((file) => {
            const option = document.createElement("option");
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });
        fileSelect.addEventListener('change', function() {
            var fileName = this.value.split('\\').pop();
            console.log(fileName);
            fetch(`http://localhost:8080/api/upload/cv/file/info/${encodeURIComponent(fileName)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('File info not found');
                }
                return response.json();
            })
            .then(jobNumbers => {
                console.log('File found in job numbers:', jobNumbers);
                jobIds = jobNumbers;
                var inputs = document.querySelectorAll('.custom-control-input');
                inputs.forEach((input) => {
                    input.checked = false;
                });
                jobNumbers.forEach((id) => {
                    console.log(document.getElementById(id).checked);
                    if (document.getElementById(id)){
                        document.getElementById(id).checked = true;
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error appropriately in your UI
            });
        });
    } catch (error) {
        console.error("Error fetching job: ", error);
        return null;
    }
}

function handleDownload(event){
    event.preventDefault();
    var fileName = document.getElementById('fileSelect').value;
    fetch(`http://localhost:8080/api/upload/cv/file/${encodeURIComponent(fileName)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('File not found');
        }
        // Get the content type from the response headers
        const contentType = response.headers.get('content-type');
        return response.blob().then(blob => ({blob, contentType}));
    })
    .then(({blob, contentType}) => {
        // Create a blob with the correct content type
        const file = new Blob([blob], { type: contentType });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error appropriately in your UI
    });
}

async function showEditForm() {
    document.getElementById("editCandidateForm").style.display = "block";
    document.getElementById("candidateForm").style.display = "none";
    document.getElementById("candidateList").style.display = "none";
    document.getElementById("addCandidateForm").style.display = "none";
}

function closeForm() {
    document.getElementById("addCandidateForm").style.display = "none";
    document.getElementById("candidateForm").style.display = "none";
    document.getElementById("candidateList").style.display = "block";
    document.getElementById("editCandidateForm").style.display = "none";
}

function createCandidate() {
    // const authToken = localStorage.getItem('authToken');
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
    const name = document.querySelector("#name").value.trim();
    const dob = document.querySelector("#dob").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const email = document.querySelector("#email").value.trim();
    const address = document.querySelector("#address").value.trim();
    const gender = document.querySelector("#gender").value.trim();
    const cv = document.querySelector("#fileSelect").value.trim();
    const skill = sub(".btn-text-1");
    const recruitercad = document.querySelector("#recruiter").value.trim();
    const note = document.querySelector("#note").value.trim();
    const status = document.querySelector("#status").value.trim();
    const exp = document.querySelector("#experience").value.trim();
    const highestLevel = document.querySelector("#level").value.trim();
    const position = document.querySelector("#position1").value.trim();
    const job = [];
    document.querySelectorAll('input[name="job"]:checked').forEach((checkbox) => {
        job.push(checkbox.value);
    });
    if (
        !name ||
        !dob ||
        !phone ||
        !status ||
        !email ||
        !address ||
        !gender ||
        !cv ||
        !position ||
        !skill ||
        !recruitercad ||
        !exp ||
        !highestLevel
    ) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Các trường cần được điền đầy đủ",
            confirmButtonText: "OK",
        });
        return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Số điện thoại phải bắt đầu bằng số 0 và bao gồm 10 chữ số.",
            confirmButtonText: "OK",
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Email phải bắt đầu bằng chữ hoặc số và kết thúc bằng @gmail.com.",
            confirmButtonText: "OK",
        });
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("gender", gender);
    formData.append("cv", cv);
    formData.append("skill", skill);
    formData.append("recruitercad", recruitercad);
    formData.append("note", note);
    formData.append("status", status);
    formData.append("exp", exp);
    formData.append("highestLevel", highestLevel);
    formData.append("position", position);
    formData.append("job", job);


    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    function submitData() {
        fetch("http://localhost:8080/api/candidate/insertCandidate", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.text().then((text) => {
                        const result = text ? JSON.parse(text) : {};
                        console.log("Success:", result);
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: "Người dùng đã được thêm thành công.",
                            confirmButtonText: "OK",
                        }).then(() => {
                            returnUser();
                        });
                    });
                } else {
                    return response.text().then((errorText) => {
                        console.error("Error:", errorText);
                        Swal.fire({
                            icon: "error",
                            title: "Lỗi",
                            text: "Đã xảy ra lỗi: " + errorText,
                            confirmButtonText: "OK",
                        });
                    });
                }
            })
            .catch((error) => {
                console.error("Network error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Lỗi Mạng",
                    text: "Đã xảy ra lỗi mạng.",
                    confirmButtonText: "OK",
                });
            });
    }

    // Gọi hàm này khi bạn muốn gửi dữ liệu
    submitData();
}

function returnUser() {
    window.location.href = "index.html";
}
var globalCv = "";
async function editCandidate(id) {
    try {
        // Show edit form
        showEditForm();

        // Fetch candidate details
        const candidateResponse = await fetch(
            `http://localhost:8080/api/candidate/getDetailCandidate/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            }
        );
        if (!candidateResponse.ok) {
            throw new Error(`HTTP error! status: ${candidateResponse.status}`);
        }

        const candidateData = await candidateResponse.json();
        // Populate candidate details in the form
        showInput(".btn-text", candidateData.skill);
        document.getElementById("candidateIDEdit").value = candidateData.id;
        document.getElementById("position").value = candidateData.position;
        document.getElementById("nameEdit").value = candidateData.name;
        document.getElementById("dobEdit").value = candidateData.dob;
        document.getElementById("phoneEdit").value = candidateData.phone;
        document.getElementById("emailEdit").value = candidateData.email;
        document.getElementById("addressEdit").value = candidateData.address;
        chuyen("genderEdit", candidateData.gender);
        document.getElementById("noteEdit").value = candidateData.note;
        chuyen("statusEdit", candidateData.status);
        document.getElementById("experienceEdit").value = candidateData.exp;
        chuyen("levelEdit", candidateData.highestLevel);
        // document.getElementById("cvFileName").innerText = `${candidateData.originalFilename}`;
        globalCv = candidateData.cv
        const API_JOB = "http://localhost:8080/api/job?status=OPEN"
        const res = await fetch(API_JOB, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
        });
        const resJson = await res.json();
        const datasJob = resJson.content;

        const jobSelect = document.getElementById("jobEdit");
        jobSelect.innerHTML = "";
        const candidateJobIds = candidateData.job.map(pos => pos.id);

        datasJob.forEach((data) => {
            const div = document.createElement('div');
            div.className = "custom-control custom-checkbox m-2";

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = data.id;
            input.name = 'jobEdit';
            input.value = data.id;
            input.className = 'custom-control-input';

            if (candidateJobIds.includes(data.id)) {
                input.checked = true;
            }

            const label = document.createElement('label');
            label.className = 'custom-control-label';
            label.htmlFor = data.id;
            label.textContent = data.title;

            div.appendChild(input);
            div.appendChild(label);
            jobSelect.appendChild(div);
        });

        const API_ENDPOINT = "http://localhost:8080/api/user?role=RECRUITER";
        const searchResponse = await fetch(API_ENDPOINT, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
        });
        const responseJson = await searchResponse.json();
        console.log(responseJson)
        const users = responseJson.content;
        const recruiterSelect = document.getElementById("recruiterEdit");
        recruiterSelect.innerHTML = "<option>Select a recruiter</option>";

        users.forEach((user) => {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.fullname;
            if (user.fullname === candidateData.recruitercad.fullname) {
                option.selected = true;
            }
            recruiterSelect.appendChild(option);
        });

        const API_CV = "http://localhost:8080/api/upload/cv/files"
        const cvRes = await fetch(API_CV, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });
        const cvFiles = await cvRes.json();
        const fileSelect = document.getElementById('fileSelectEdit');
        fileSelect.innerHTML = "";
        cvFiles.forEach((file) => {
            const option = document.createElement("option");
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });
        fileSelect.value = globalCv;
        fileSelect.addEventListener('change', function() {
            var fileName = this.value.split('\\').pop();
            console.log(fileName);
            fetch(`http://localhost:8080/api/upload/cv/file/info/${encodeURIComponent(fileName)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('File info not found');
                }
                return response.json();
            })
            .then(jobNumbers => {
                console.log('File found in job numbers:', jobNumbers);
                jobIds = jobNumbers;
                var inputs = document.querySelectorAll('.custom-control-input');
                inputs.forEach((input) => {
                    input.checked = false;
                });
                jobNumbers.forEach((id) => {
                    console.log(document.getElementById(id).checked);
                    if (document.getElementById(id)){
                        document.getElementById(id).checked = true;
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error appropriately in your UI
            });
        });

    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

function handleDownloadEdit(event){
    event.preventDefault();
    var fileName = document.getElementById('fileSelectEdit').value;
    fetch(`http://localhost:8080/api/upload/cv/file/${encodeURIComponent(fileName)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('File not found');
        }
        // Get the content type from the response headers
        const contentType = response.headers.get('content-type');
        return response.blob().then(blob => ({blob, contentType}));
    })
    .then(({blob, contentType}) => {
        // Create a blob with the correct content type
        const file = new Blob([blob], { type: contentType });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error appropriately in your UI
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

function editCandidateData() {
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
    const name = document.querySelector("#nameEdit").value.trim();
    const dob = document.querySelector("#dobEdit").value.trim();
    const phone = document.querySelector("#phoneEdit").value.trim();
    const email = document.querySelector("#emailEdit").value.trim();
    const address = document.querySelector("#addressEdit").value.trim();
    const gender = document.querySelector("#genderEdit").value.trim();
    const cv = document.querySelector("#fileSelectEdit").value.trim();
    const skill = sub(".btn-text");
    const recruitercad = document.querySelector("#recruiterEdit").value.trim();
    const note = document.querySelector("#noteEdit").value.trim();
    const status = document.querySelector("#statusEdit").value.trim();
    const exp = document.querySelector("#experienceEdit").value.trim();
    const highestLevel = document.querySelector("#levelEdit").value.trim();
    const id = document.querySelector("#candidateIDEdit").value.trim();
    const position = document.querySelector("#position").value.trim();
    const job = [];
    document.querySelectorAll('input[name="jobEdit"]:checked').forEach((checkbox) => {
        job.push(checkbox.value);
    });

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Số điện thoại phải bắt đầu bằng số 0 và bao gồm 10 chữ số.",
            confirmButtonText: "OK",
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Email phải bắt đầu bằng chữ hoặc số và kết thúc bằng @gmail.com.",
            confirmButtonText: "OK",
        });
        return;
    }

    const formData = new FormData();
    formData.append("id", id)
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("gender", gender);
    formData.append("cv", cv);
    formData.append("skill", skill);
    formData.append("recruitercad", recruitercad);
    formData.append("note", note);
    formData.append("status", status);
    formData.append("exp", exp);
    formData.append("highestLevel", highestLevel);
    formData.append("position", position);
    formData.append("job", job);


    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }



    function submitData() {
        const URL = `http://localhost:8080/api/candidate/updateCandidate/${id}`;
        fetch(URL, {
            method: "POST",
            headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.text().then((text) => {
                        const result = text ? JSON.parse(text) : {};
                        console.log("Success:", result);
                        Swal.fire({
                            icon: "success",
                            title: "Thành công",
                            text: "Người dùng đã được update thành công.",
                            confirmButtonText: "OK",
                        }).then(() => {
                            returnUser();
                        });
                    });
                } else {
                    return response.text().then((errorText) => {
                        console.error("Error:", errorText);
                        Swal.fire({
                            icon: "error",
                            title: "Lỗi",
                            text: "Đã xảy ra lỗi: " + errorText,
                            confirmButtonText: "OK",
                        });
                    });
                }
            })
            .catch((error) => {
                console.error("Network error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Lỗi Mạng",
                    text: "Đã xảy ra lỗi mạng.",
                    confirmButtonText: "OK",
                });
            });
    }

    // Gọi hàm này khi bạn muốn gửi dữ liệu
    submitData();
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
        deleteCandidate(id);
    });
}

async function deleteCandidate(id) {
    await fetch(`http://localhost:8080/api/candidate/deleteCandidate/${id}`, {
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

const btnSearchCandidate = document.getElementById("btn_search");
btnSearchCandidate.addEventListener("click", async function () {
    let inputSearch = document.getElementById("search").value;
    try {
        const API_ENDPOINT =
            "http://localhost:8080/api/candidate/getListCandidate?search=" +
            inputSearch +
            "&page=" +
            page +
            "&size=" +
            size;
        const searchResponse = await fetch(API_ENDPOINT, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
        });
        let data = await searchResponse.json();
        displayCandidate(data.content);
        console.log(data);
        const quantity = document.getElementById("quantity");
        quantity.innerHTML =
            data.content.length + "/" + data.totalElements + " rows";

        const prev = document.getElementById("prev");
        const next = document.getElementById("next");
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
});

async function banCandidate() {
    const id = document.querySelector("#idDetail").value.trim();
    if (!id) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "ID không được để trống.",
            confirmButtonText: "OK",
        });
        return;
    }

    const candidateResponse = await fetch(
        `http://localhost:8080/api/candidate/getDetailCandidate/${id}`,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
        }
    );

    if (!candidateResponse.ok) {
        throw new Error(`HTTP error! status: ${candidateResponse.status}`);
    }
    const candidateData = await candidateResponse.json();
    chuyen("levelEdit", candidateData.highestLevel);
    const candidateStatus = document.getElementById("statusDetail").textContent;
    let status = "";
    if (candidateStatus == "BANNED") {
        status = "OPEN";
    } else {
        status = "BANNED";
    }
    const requestData = {
        status: status,
    };
    const URL = `http://localhost:8080/api/candidate/banCandidate/${id}?status=` + status
    alert(URL);
    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (response.ok) {
                return response.text().then((text) => {
                    const result = text ? JSON.parse(text) : {};
                    console.log("Success:", result);
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: "Thành công.",
                        confirmButtonText: "OK",
                    }).then(() => {
                        returnUser();
                    });
                });
            } else {
                return response.text().then((errorText) => {
                    console.error("Error:", errorText);
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi",
                        text: "Đã xảy ra lỗi: " + errorText,
                        confirmButtonText: "OK",
                    });
                });
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Lỗi Mạng",
                text: "Đã xảy ra lỗi mạng.",
                confirmButtonText: "OK",
            });
        });
}

function statusFilter() {
    const statusSelect = document.getElementById('statusSelect');
    const selectedStatus = statusSelect.value;
    search = selectedStatus
    if (selectedStatus) {
        const page = 0; // Cần khai báo giá trị cho `page`
        const size = 10; // Cần khai báo giá trị cho `size`
        const API_ENDPOINT = `http://localhost:8080/api/candidate/getListCandidate?search=${encodeURIComponent(selectedStatus)}&page=${page}&size=${size}`;

        fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('API response:', data);
                // Xử lý dữ liệu nhận được từ API
                getCandidate()
            })
            .catch(error => {
                console.error('Error calling API:', error);
            });
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
        if (s.toLowerCase().includes(item.innerText.toLowerCase())) {
            item.closest("li").classList.toggle("checked");
        }
    });
}