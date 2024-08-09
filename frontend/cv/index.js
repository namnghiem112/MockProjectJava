const authToken = localStorage.getItem('authToken');
var jobs = [];
const selectBtn = document.querySelector(".select-btn");
const resultSelection = document.getElementById('result');
let extractedEmail;

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../auth/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch(`http://localhost:8080/api/job?status=OPEN&size=99999`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Get Job error');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const tbody = document.getElementById("tbody_job");
            tbody.innerHTML = "";
            jobs = data.content;
            jobs.forEach((job) => {
                if (job.checked) {
                  const tr = document.createElement("tr");
                  tr.innerHTML = `<td><input type="checkbox" class="rowCheckbox"></td>
                                <td>${job.id}</td>
                                <td>${job.title}</td>
                                <td>${job.skill}</td>
                                <td>${job.startDate}</td>
                                <td>${job.endDate}</td>
                                <td>${job.level}</td>`
                  tbody.appendChild(tr);
                }
              });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function handleSubmit(event){
    event.preventDefault();
    var selectedJobs = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const row = checkbox.closest('tr'); // Get the closest row (tr)
            selectedJobs.push(row.cells[1].innerText);
        }
    });
    if (selectedJobs.length == 0){
        Swal.fire({
            title: 'Error!',
            text: 'Please choose a job',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
    else {
        const fileInput = document.getElementById('cv-input');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a PDF file first.');
            return;
        }

        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobs', selectedJobs.join(','));
        formData.append('email', extractedEmail[0] || '');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        fetch(`http://localhost:8080/api/upload/cv`, { 
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Error uploading CV!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            // return response.json();
        })
        .then(data => {
            // document.getElementById('result').textContent = 'File uploaded successfully. Server response: ' + JSON.stringify(data);
            Swal.fire({
                title: 'Success!',
                text: 'Upload CV successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // document.getElementById('result').textContent = 'Error uploading file: ' + error.message;
        });
    }
    
}

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

document.getElementById('cv-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const typedarray = new Uint8Array(e.target.result);

        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            let textContent = '';

            function getPageText(pageNum) {
                return pdf.getPage(pageNum).then(function(page) {
                    return page.getTextContent();
                }).then(function(content) {
                    return content.items.map(item => item.str).join(' ');
                });
            }

            const pagePromises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                pagePromises.push(getPageText(i));
            }

            Promise.all(pagePromises).then(function(pageTexts) {
                textContent = pageTexts.join(' ');
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                extractedEmail = textContent.match(emailRegex) || [];
                // Log the extracted emails to the console
                console.log('Extracted emails:', extractedEmail);
            });
        }).catch(function(error) {
            console.error('Error: ', error);
            // document.getElementById('result').textContent = 'Error processing the PDF file.';
        });
    };

    reader.readAsArrayBuffer(file);
});

