const authToken = localStorage.getItem('authToken');
const us=localStorage.getItem('username')
let offerID = null;
var temp_data;
let role;
let stt;
function checkTokenExpiration() {
    if (!authToken) {
        window.location.href = '../auth/login.html';
        return false;
    }
}
async function fetchOfferData() {
    try {
        const response = await fetch(`http://localhost:8080/api/offers/view/${offerID}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        temp_data = data;
        console.log(data)
        updateOfferDetails(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function formatCurrency(amount) {
    const number = parseFloat(String(amount).replace(/[^0-9]/g, ""));
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

function updateOfferDetails(data) {
    document.getElementById('candidate').textContent = data.candidateOffer.name;
    document.getElementById('position').textContent = data.position;
    document.getElementById('approver').textContent = data.approver.fullname;
    document.getElementById('rjnote').textContent = data.rejectNote;
    if (data.interview) {
        const interview = data.interview;
        const interviewTitle = interview.title || 'N/A';
        const interviewResult = interview.result || 'N/A';
        const jobTitle = interview.job.title || 'N/A';

        const interviewersList = interview.interviewers.length > 0 
            ? interview.interviewers.map(interviewer => interviewer.interviewerId.fullname).join(', ')
            : 'N/A';

            document.getElementById('interview_info').innerHTML = 
            `Title: ${interviewTitle}<br>` +
            `Interviewers: ${interviewersList}<br>` +
            `Result: ${interviewResult}<br>` +
            `Job : ${jobTitle}<br>`;
    } else {
        document.getElementById('interview_info').textContent = 'N/A';
    }

    document.getElementById('contract_period').textContent = `${data.contractStart} to ${data.contractEnd}`;
    document.getElementById('interview_note').textContent = data.note;
    document.getElementById('status').textContent = data.status;
    document.getElementById('contract_type').textContent = data.contractType;
    document.getElementById('level').textContent = data.level;
    document.getElementById('department').textContent = data.department;
    document.getElementById('recruiter_owner').textContent = data.candidateOffer.recruitercad.fullname;
    document.getElementById('salary').textContent = formatCurrency(data.basicSalary);
    document.getElementById('interview_note').innerHTML = 
    `InterviewNote: ${data.interview.note}<br>` +
    `InterviewerNote: ${data.interview.interviewerNote}<br>` +
    `Score: ${data.interview.score}` ;
    document.getElementById('note').textContent = data.note;
    document.getElementById('due_date').textContent = data.dueDate;
    document.getElementById('rjnote').textContent = data.rejectNote;
    stt=data.status
    let username=data.approver.username
    if ( (role.includes('ROLE_ADMIN') || role.includes('ROLE_MANAGER')&&username===us)) {
        if(stt === 'WAITING_FOR_APPROVAL'){
        document.getElementById('approveButton').style.display = 'block';
        document.getElementById('rejectButton').style.display = 'block';
        }
        else if (stt === 'APPROVED'){
            document.getElementById('markSentButton').style.display = 'block';
            document.getElementById('approveButton').style.display = 'none';
            document.getElementById('rejectButton').style.display = 'none';
            document.getElementById('candidateResponseButtons').style.display = 'none';
        }
        else if (stt==='REJECTED'){
            document.getElementById('rejectNoteContainer').style.display = 'flex';
            document.getElementById('approveButton').style.display = 'none';
            document.getElementById('rejectButton').style.display = 'none';
            document.getElementById('candidateResponseButtons').style.display = 'none';
            document.getElementById('markSentButton').style.display = 'none';
            document.getElementById('rjnote').style.display = 'flex';
        }
        else if(stt==='WAITING_FOR_RESPONSE'){
            document.getElementById('candidateResponseButtons').style.display = 'block';
            document.getElementById('markSentButton').style.display = 'none';
            document.getElementById('approveButton').style.display = 'none';
            document.getElementById('rejectButton').style.display = 'none';
        }
        else if (stt==='CANCELLED'){
            document.getElementById('approveButton').style.display = 'none';
            document.getElementById('rejectButton').style.display = 'none';
            document.getElementById('candidateResponseButtons').style.display = 'none';
            document.getElementById('markSentButton').style.display = 'none';
            document.getElementById('editButton').style.display = 'none';
            document.getElementById('canceloffer').style.display = 'none';
        }
        else {
            document.getElementById('approveButton').style.display = 'none';
            document.getElementById('rejectButton').style.display = 'none';
            document.getElementById('candidateResponseButtons').style.display = 'none';
            document.getElementById('markSentButton').style.display = 'none';
        } 
        
    }
    else if (role.includes('ROLE_RECRUITER')){
        document.getElementById('rejectNoteContainer').style.display = 'flex';
        document.getElementById('approveButton').style.display = 'none';
            document.getElementById('rejectButton').style.display = 'none';
            document.getElementById('candidateResponseButtons').style.display = 'none';
            document.getElementById('markSentButton').style.display = 'none';
    }
    else {
        document.getElementById('approveButton').style.display = 'none';
        document.getElementById('rejectButton').style.display = 'none';
        document.getElementById('candidateResponseButtons').style.display = 'none';
        document.getElementById('markSentButton').style.display = 'none';
    } 
}
function openRejectModal() {
    document.getElementById('rejectModal').style.display = 'block';
  }
  
  function closeRejectModal() {
    document.getElementById('rejectModal').style.display = 'none';
  }
  let rjn=null
async function updateStatus(newStatus) {
    temp_data.status = newStatus;
    temp_data.id = offerID;
    const payload = {
        id: temp_data.id,
        contractType: temp_data.contractType,
        position: temp_data.position,
        level: temp_data.level,
        contractStart: temp_data.contractStart,
        contractEnd: temp_data.contractEnd,
        department: temp_data.department,
        dueDate: temp_data.dueDate,
        rejectNote:rjn,     
        basicSalary: temp_data.basicSalary,
        note: temp_data.note,
        status: temp_data.status,
        // interview: temp_data.interview,
        // approver: temp_data.approver,
        // recruiter: temp_data.recruiter,
        // candidateOffer: temp_data.candidateOffer,
        interview: {
            id: temp_data.interview.id
          },
          approver: {
            id: temp_data.approver.id
          },
          recruiter: {
            id: temp_data.candidateOffer.recruitercad.id
          },
          candidateOffer: {
            id: temp_data.candidateOffer.id
          },
    };

    try {
        const response = await fetch(`http://localhost:8080/api/offers/update/${offerID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const updatedData = await response.json();
        fetchOfferData();
    } catch (error) {
        console.error('There has been a problem with your update operation:', error);
    }
}


document.getElementById('approveButton').addEventListener('click', function() {
    updateStatus('APPROVED');
});

document.getElementById('markSentButton').addEventListener('click', function() {
    updateStatus('WAITING_FOR_RESPONSE');
});

document.getElementById('rejectButton').addEventListener('click', function() {
    openRejectModal();
});
document.getElementById('submitRejectNote').addEventListener('click', function() {
    const rejectNoteInput = document.getElementById('rejectNoteInput').value;
    rjn = rejectNoteInput;
    updateStatus('REJECTED');  
    closeRejectModal(); 
});
document.getElementById('acceptoffer').addEventListener('click', function() {
    updateStatus('ACCEPTED');
});
document.getElementById('declineoffer').addEventListener('click', function() {
    updateStatus('DECLINED');
});
document.getElementById('canceloffer').addEventListener('click', function() {
    updateStatus('CANCELLED');
});

function editOffer() {
    event.preventDefault()
    console.log(offerID)
    if (offerID) {
        window.location.href = `editoffer.html?id=${offerID}`;
    } else {
        console.error('Offer ID is not available.');
    }
}
function returnOffer() {
    window.location.href = '/../offer/index.html';
}
document.addEventListener('DOMContentLoaded', () => {
    checkTokenExpiration();
    const urlParams = new URLSearchParams(window.location.search);
    offerID = urlParams.get('id');
    const decodedToken = jwt_decode(authToken);
    role = decodedToken.roles;
    fetchOfferData();
});

