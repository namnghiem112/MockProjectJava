const authToken = localStorage.getItem('authToken');
var interviewers = '';
var job;
var candidate;
var recruiter;
var role;
var interview;
const interviewerSpan = document.getElementById('interviewers');
const jobSpan = document.getElementById('job');
const recruiterSpan = document.getElementById('recruiter');
const actionButton = document.getElementById('action');
const submit = document.getElementById('submit');
const params = new URLSearchParams(window.location.search);
const infoBox = document.getElementById('info-box');
const id = params.get('id');

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../auth/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) jwtDecode();
    else window.location.href = '../auth/login.html';
    if (role == "ROLE_INTERVIEWER"){
        actionButton.textContent = "Submit result";
        document.getElementById('send').hidden = true;
    }
    else {
        document.getElementById('exportButton').hidden = true;
        document.getElementById('action').textContent = "Edit";
    }
    fetch(`http://localhost:8080/api/interview/get/${id}`, {
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: `Interview ID: ${id} not found!`
                      }).then((result) => {
                        if (result.isConfirmed) {
                            history.back();
                        }
                    });
                }
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            interview = data;
            // data.interviewers.forEach((item, index) => {
            //     if (index > 0) {
            //         interviewers += ', ';
            //     }
            //     interviewers += `${item.fullname} (${item.username})`;
            // });
            data.interviewers.forEach((interviewer, index) => {
                const span = document.createElement('span');
                span.textContent = `${interviewer.fullname} (${interviewer.username})`;
                span.setAttribute('data-info', JSON.stringify(interviewer));
                // span.setAttribute('department', interviewer.department);
                // span.setAttribute('gender', interviewer.username);
                span.classList.add('interviewer-item');
                
                // Append to the span
                interviewerSpan.appendChild(span);
                
                // Add a comma if it's not the last item
                if (index < data.interviewers.length - 1) {
                    interviewerSpan.appendChild(document.createTextNode(', '));
                }
            });
            console.log(interviewers);
            // interviewerSpan.textContent = interviewers;
            recruiter = data.recruiter;
            const span = document.createElement('span');
            span.textContent = `${recruiter.fullname} (${recruiter.username})`;
            span.setAttribute('data-info', JSON.stringify(recruiter));
            // span.setAttribute('department', interviewer.department);
            // span.setAttribute('gender', interviewer.username);
            span.classList.add('interviewer-item');
            recruiterSpan.appendChild(span);

            const items = document.querySelectorAll('.interviewer-item');
            items.forEach(item => {
                item.addEventListener('mouseenter', (event) => {
                    const interviewer = JSON.parse(item.getAttribute('data-info'));
                    infoBox.innerHTML = `
                    <span>Email: ${interviewer.email}</span>
                    </br>
                    <span>Department: ${interviewer.department}</span>
                    `;
                    infoBox.style.display = 'block';
                    infoBox.style.left = `${event.pageX + 10}px`;
                    infoBox.style.top = `${event.pageY + 10}px`;
                });

                item.addEventListener('mouseleave', () => {
                    infoBox.style.display = 'none';
                });
            });
            candidate = data.candidate;
            const spanCan = document.createElement('span');
            spanCan.textContent = `${candidate.name}`;
            spanCan.setAttribute('data-info', JSON.stringify(candidate));
            // span.setAttribute('department', interviewer.department);
            // span.setAttribute('gender', interviewer.username);
            spanCan.classList.add('can-item');
            document.getElementById('candidate').appendChild(spanCan);
            const Citems = document.querySelectorAll('.can-item');
            Citems.forEach(item => {
                item.addEventListener('mouseenter', (event) => {
                    const candidate = JSON.parse(item.getAttribute('data-info'));
                    infoBox.innerHTML = `
                    <span>Email: ${candidate.email}</span>
                    </br>
                    <span>Skills: ${candidate.skill}</span>
                    </br>
                    <span>Year of experience: ${candidate.exp}</span>
                    `;
                    infoBox.style.display = 'block';
                    infoBox.style.left = `${event.pageX + 10}px`;
                    infoBox.style.top = `${event.pageY + 10}px`;
                });

                item.addEventListener('mouseleave', () => {
                    infoBox.style.display = 'none';
                });
            });
            job = data.job;
            const spanJob = document.createElement('span');
            spanJob.textContent = `${job.title}`;
            spanJob.setAttribute('data-info', JSON.stringify(job));
            // span.setAttribute('department', interviewer.department);
            // span.setAttribute('gender', interviewer.username);
            spanJob.classList.add('job-item');
            jobSpan.appendChild(spanJob);
            const Jitems = document.querySelectorAll('.job-item');
            Jitems.forEach(item => {
                item.addEventListener('mouseenter', (event) => {
                    const job = JSON.parse(item.getAttribute('data-info'));
                    infoBox.innerHTML = `
                    <span>Level: ${job.level}</span>
                    </br>
                    <span>Status: ${job.status}</span>
                    </br>
                    <span>Working address: ${job.workingAddress}</span>
                    `;
                    infoBox.style.display = 'block';
                    infoBox.style.left = `${event.pageX + 10}px`;
                    infoBox.style.top = `${event.pageY + 10}px`;
                });

                item.addEventListener('mouseleave', () => {
                    infoBox.style.display = 'none';
                });
            });
            // document.getElementById('recruiter').textContent = `${recruiter.fullname} (${recruiter.username})`;
            document.getElementById('title').textContent = data.title;
            // document.getElementById('job').textContent = job.title;
            // document.getElementById('candidate').textContent = candidate.name;
            document.getElementById('status').textContent = data.status;
            document.getElementById('date').textContent = data.date;
            document.getElementById('timeStart').textContent = data.timeStart;
            document.getElementById('timeEnd').textContent = data.timeEnd   ;
            if (data.result) document.getElementById('result').textContent = data.result;
            else document.getElementById('result').textContent = "N/A"
            if (data.meetingLink) document.getElementById('meetingLink').textContent = data.meetingLink;
            else document.getElementById('meetingLink').textContent = "N/A"
            if (data.note) document.getElementById('note').textContent = data.note;
            else document.getElementById('note').textContent = "N/A"
            if (data.location) document.getElementById('location').textContent = data.location;
            else document.getElementById('location').textContent = "N/A"
            document.getElementById('score').textContent = data.score;
            if (data.interviewerNote) document.getElementById('interviewer_note').textContent = data.interviewerNote;
            else document.getElementById('interviewer_note').textContent = "N/A"
            // document.getElementById('exportButton').addEventListener('click', () => exportToExcel(data));
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    
});

function handleSubmit(event){
    event.preventDefault();
    window.location.href = `editinterview.html?id=${id}`;
}

function isValidJSON(value) {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
}

function jwtDecode(){
    const decodedToken = jwt_decode(authToken);
    role = decodedToken.roles;
    console.log(role);
}

function sendRemind(){
    fetch(`http://localhost:8080/api/interview/remind/${id}`, {
        method: 'POST',
        headers:{
            'Authorization': `Bearer ${authToken}`
        }
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
                text: 'Send remind successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            return response.json();
        })
        .then(data => {
            // console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error when send reminder!'
              });
        });
}

// function exportToExcel() {
//     // console.log(candidate);
//     const candidateInfo = [
//       ['ID', 'Name', 'Gender', 'DOB', 'Current Position', 'Skills', 'Year of Experience', 'Highest level'],
//       [candidate.id, candidate.name, candidate.gender, candidate.dob, candidate.position, candidate.skill, candidate.exp, candidate.highestLevel]
//       // Add more candidate rows as needed
//     ];

//     const resultsAndNotes = [
//       ['Score', 'Note'],
//       ['', '']
//       // Add more result and note rows as needed
//     ];

//     // Create workbook and add sheets
//     const wb = XLSX.utils.book_new();
//     const ws1 = XLSX.utils.aoa_to_sheet(candidateInfo);
//     const ws2 = XLSX.utils.aoa_to_sheet(resultsAndNotes);

//     // Apply styles to headers
//     const boldHeaderStyle = { font: { bold: true } };
//     Object.keys(ws1).forEach(cell => {
//       if (cell.startsWith('A1') || cell.startsWith('B1') || cell.startsWith('C1') || cell.startsWith('D1')) {
//         ws1[cell].s = boldHeaderStyle;
//       }
//     });
//     Object.keys(ws2).forEach(cell => {
//       if (cell.startsWith('A1') || cell.startsWith('B1')) {
//         ws2[cell].s = boldHeaderStyle;
//       }
//     });

//     // Adjust column widths
//     const setColumnWidths = (ws, data) => {
//       const columnWidths = data[0].map((_, i) => {
//         const maxLength = Math.max(...data.map(row => (row[i] ? row[i].toString().length : 0)));
//         return { wch: maxLength + 2 }; // +2 for padding
//       });
//       ws['!cols'] = columnWidths;
//     };

//     setColumnWidths(ws1, candidateInfo);
//     setColumnWidths(ws2, resultsAndNotes);

//     XLSX.utils.book_append_sheet(wb, ws1, 'Candidate Info');
//     XLSX.utils.book_append_sheet(wb, ws2, 'Results and Notes');

//     // Export the workbook
//     XLSX.writeFile(wb, `${candidate.id}-${candidate.name}-${job.title}.xlsx`);
//   }

async function exportToExcel() {
    // Sample candidate and job data
    const candidateInfo = [
        [],
        ['ID', 'Name', 'Gender', 'DOB', 'Current Position', 'Skills', 'Year of Experience', 'Highest level'],
        [candidate.id, candidate.name, candidate.gender, candidate.dob, candidate.position, candidate.skill, candidate.exp, candidate.highestLevel],
        []
    ];
    var ints = "";
    interview.interviewers.forEach((item, i) => {
        if (i > 0) ints += ", ";
        ints +=  `${item.fullname} (${item.username})`;
    })
    const interviewInfo = [
        [],
        ['ID', 'Title', 'Date', 'Job', 'Interviewer', 'Note'],
        [interview.id, interview.title, interview.date + ", " + interview.timeStart + " to " + interview.timeEnd, job.title, ints, interview.note]
    ]

    const resultsAndNotes = [
        [],
        ['Score', 'Result', 'Note'],
        ['', '', '']
        // Add more result and note rows as needed
    ];

    // Create a new workbook and add sheets
    const workbook = new ExcelJS.Workbook();
    const ws1 = workbook.addWorksheet('Candidate Info');
    const ws2 = workbook.addWorksheet('Interview Info');
    const ws3 = workbook.addWorksheet('Results and Notes');
    // Add rows to the worksheets
    ws1.addRows(candidateInfo);
    ws1.mergeCells('A1:H1');
    // Style the merged cell (optional)
    ws1.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    ws1.getCell('A1').font = { bold: true };
    ws2.addRows(interviewInfo);
    ws2.mergeCells('A1:F1');
    // Style the merged cell (optional)
    ws2.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    ws2.getCell('A1').font = { bold: true };
    ws3.addRows(resultsAndNotes);
    ws3.mergeCells('A1:C1');
    // Style the merged cell (optional)
    ws3.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    ws3.getCell('A1').font = { bold: true };

    // Apply styles to headers
    const boldHeaderStyle = { font: { bold: true } };

    ws1.getRow(2).eachCell({ includeEmpty: true }, (cell) => {
        cell.style = boldHeaderStyle;
    });

    ws1.getRow(3).eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { horizontal: 'left' };
    });

    ws2.getRow(2).eachCell({ includeEmpty: true }, (cell) => {
        cell.style = boldHeaderStyle;
    });

    ws2.getRow(3).eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { horizontal: 'left' };
    });

    ws3.getRow(2).eachCell({ includeEmpty: true }, (cell) => {
        cell.style = boldHeaderStyle;
    });

    ws3.getRow(3).eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { horizontal: 'left' };
    });


    // Adjust column widths
    const setColumnWidths = (worksheet, data, row) => {
        data[row].forEach((_, i) => {
            const maxLength = Math.max(...data.map(row => (row[i] ? row[i].toString().length : 0)));
            worksheet.getColumn(i + 1).width = maxLength + 2; // +2 for padding
        });
    };

    setColumnWidths(ws1, candidateInfo, 1);
    setColumnWidths(ws2, interviewInfo, 1);
    setColumnWidths(ws3, resultsAndNotes, 0);
    ws3.getColumn('C').width = 30;

    ws1.getCell('A1').value = 'Candidate info';
    ws2.getCell('A1').value = 'Interview info';
    ws3.getCell('A1').value = 'Result and note';

    // Define dropdown options
    const scoreOptions = Array.from({ length: 11 }, (_, i) => i.toString()); // 0 to 10
    const resultOptions = ['PASSED', 'FAILED'];

    // Add dropdown lists to specific cells
    const addDropdown = (worksheet, cellAddress, options) => {
        worksheet.getCell(cellAddress).dataValidation = {
            type: 'list',
            formulae: [`"${options.join(',')}"`],
            allowBlank: true,
            showErrorMessage: true,
        };
    };

    // Apply data validation to A2 and B2
    addDropdown(ws3, 'A3', scoreOptions); // Score column
    addDropdown(ws3, 'B3', resultOptions); // Result column

    // ws1.protect({ 
    //     password: 'qwertyasdghh',  // Optional: Set a password to unprotect the sheet
    //     selectLockedCells: false,
    //     selectUnlockedCells: true
    // });

    // Export the workbook to a file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create a link element and trigger download
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.id}-${candidate.name}-${job.title}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
}

