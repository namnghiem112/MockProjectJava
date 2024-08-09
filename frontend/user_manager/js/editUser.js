let authToken = localStorage.getItem('authToken');
let refreshToken = localStorage.getItem('refreshToken');
let userID = null;
let to = '';
let username = '';
let password = '';
let originafullname = '';
let originEmail = '';

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    userID = urlParams.get('id'); 
    
    if (userID) {
        fetchUserDetails(userID); 
    }
});

function returnUserDetails() {
    window.location.href = `userdetails.html?id=${userID}`;
}

async function fetchUserDetails(id) {
    try {
        if ( isTokenExpired(authToken)) {
            const tokens = await refreshAuthToken();
            if (tokens) {
                authToken = tokens.accessToken;
                refreshToken = tokens.refreshToken;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                throw new Error('Unable to refresh token');
            }
        }
        const response = await fetch(`http://localhost:8080/api/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        });
        const data = await response.json();
        displayUserDetails(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayUserDetails(user) {
    document.getElementById('name').value = user.fullname || '';
    document.getElementById('dob').value = user.dob || '';
    document.getElementById('phone').value = user.phone || '';
    
    setSelectValue('roles', user.role);
    setSelectValue('status', user.status);
    
    document.getElementById('email').value = user.email || '';
    document.getElementById('address').value = user.address || '';
    setSelectValue('gender', user.gender);
    setSelectValue('department', user.department);
    document.getElementById('note').value = user.note || '';
}

function setSelectValue(selectId, value) {
    const select = document.getElementById(selectId);
    if (select) {
        for (let option of select.options) {
            if (option.value === value) {
                option.selected = true;
                break;
            }
        }
    }
}

async function editUser(event) {
    event.preventDefault();

    const fullname = document.querySelector('#name').value.trim();
    const dob = document.querySelector('#dob').value.trim();
    const phone = document.querySelector('#phone').value.trim();
    const role = document.querySelector('#roles').value.trim();
    const status = document.querySelector('#status').value.trim();
    const email = document.querySelector('#email').value.trim();
    const address = document.querySelector('#address').value.trim();
    const gender = document.querySelector('#gender').value.trim();
    const department = document.querySelector('#department').value.trim();
    const note = document.querySelector('#note').value.trim();

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\.com$/;
        return emailPattern.test(email);
    }

    function validatePhone(phone) {
        const phonePattern = /^0\d{9}$/;
        return phonePattern.test(phone);
    }

    if (!fullname || !dob || !phone || !role || !status || !email || !address || !gender || !department) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng điền tất cả các trường bắt buộc được đánh dấu bằng *.',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!validateEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi Email',
            text: 'Email phải bắt đầu bằng chữ hoặc số, không có ký tự đặc biệt và kết thúc bằng @gmail.com.',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!validatePhone(phone)) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi Số Điện Thoại',
            text: 'Số điện thoại phải bắt đầu bằng số 0 và bao gồm 10 chữ số.',
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
        createdDate 
    };
    
    try {
        if ( isTokenExpired(authToken)) {
            const tokens = await refreshAuthToken();
            if (tokens) {
                authToken = tokens.accessToken;
                refreshToken = tokens.refreshToken;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                throw new Error('Unable to refresh token');
            }
        }
        const response = await fetch(`http://localhost:8080/api/user/update/${userID}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const text = await response.text();
            const result = text ? JSON.parse(text) : {};
            originEmail = result.email;
            originafullname = result.fullname;
            to = email;
            username = result.username;
            password = result.password;
            console.log('Success:', result);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Thông tin người dùng đã được cập nhật thành công.',
                confirmButtonText: 'OK'
            }).then(() => {
                if (originafullname !== fullname || originEmail !== email) {
                    sendEmail();
                }
                else if (originafullname !== fullname){
                    sendEmail();
                }
                else if (originEmail !== email){
                    sendEmail();
                }
                returnUserDetails();
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

async function sendEmail() {
    const requestData = {
        to: to,
        username: username,
        password: password
    };
    try {
        if ( isTokenExpired(authToken)) {
            const tokens = await refreshAuthToken();
            if (tokens) {
                authToken = tokens.accessToken;
                refreshToken = tokens.refreshToken;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                throw new Error('Unable to refresh token');
            }
        }
        const emailResponse = await fetch('http://localhost:8080/api/user/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestData)
        });

        if (emailResponse.ok) {
            const emailText = await emailResponse.text();
            const emailResult = emailText ? JSON.parse(emailText) : {};
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Thông tin tài khoản đã được gửi qua email.',
                confirmButtonText: 'OK'
            });
        } else {
            const emailErrorText = await emailResponse.text();
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi gửi email: ' + emailErrorText,
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi Mạng',
            text: 'Đã xảy ra lỗi mạng khi gửi email.',
            confirmButtonText: 'OK'
        });
    }
}


function isTokenExpired(token) {
    const payload = parseJwt(token);
    if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000); 
        return currentTime >= payload.exp;
    }
    return true;
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = decodeURIComponent(atob(base64Url).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(base64);
    } catch (e) {
        return null;
    }
}

async function refreshAuthToken() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            return data;
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '../auth/login.html';
            return null;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '../auth/login.html';
        return null;
    }
}
