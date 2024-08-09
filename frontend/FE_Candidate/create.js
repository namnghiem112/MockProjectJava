const authToken = localStorage.getItem('authToken');
async function createCandidate(event) {
    const fullname = document.querySelector('#name').value.trim();
    const dob = document.querySelector('#dob').value.trim();
    const phone = document.querySelector('#phone').value.trim();
    const email = document.querySelector('#email').value.trim();
    const address = document.querySelector('#address').value.trim();
    const gender = document.querySelector('#gender').value.trim();
    const cv = document.querySelector('#cv').value.trim();
    const position = document.querySelector('#position').value.trim();
    const skills = document.querySelector('#skills').value.trim();
    const recruiter = document.querySelector('#recruiter').value.trim();
    const note = document.querySelector('#note').value.trim();
    const status = document.querySelector('#status').value.trim();
    const experience = document.querySelector('#experience').value.trim();
    const level = document.querySelector('#level').value.trim();

    if (!fullname || !dob || !phone || !role || !status || !email || !address || !gender || !department || !cv || !position || !skills || !recruiter || !experience || !level) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng điền tất cả các trường bắt buộc được đánh dấu bằng *.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    function validatePhone(phone) {
        if (!phoneRegex.test(phone)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Số điện thoại phải bắt đầu bằng số 0 và bao gồm 10 chữ số.',
                confirmButtonText: 'OK'
            });
            return false;
        }
        return true;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Email phải bắt đầu bằng chữ hoặc số và kết thúc bằng @gmail.com.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const createdDate = new Date().toISOString();

    const requestData = {
        fullname,
        dob,
        phone,
        role,
        status,
        email,
        address,
        gender,
        department,
        note,
        createdDate,
        cv,
        position,
        skills,
        recruiter,
        experience,
        level
    };

    try {
        const response = await fetch('http://localhost:8080/api/candidate/insertCandidate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            const text = await response.text();
            const result = text ? JSON.parse(text) : {};
            console.log('Success:', result);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Người dùng đã được thêm thành công.',
                confirmButtonText: 'OK'
            }).then(() => {
                returnUser();
            });
        } else {
            const errorText = await response.text();
            console.error('Error:', errorText);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi: ' + errorText,
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Network error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi Mạng',
            text: 'Đã xảy ra lỗi mạng.',
            confirmButtonText: 'OK'
        });
    }
}

function returnUser() {
    window.location.href = "index.html";
}
