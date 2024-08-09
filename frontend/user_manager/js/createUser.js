let authToken = localStorage.getItem('authToken');
let refreshToken = localStorage.getItem('refreshToken');
let to = '';
let username = '';
let password = '';
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

async function createUser(event) {
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

    if (!fullname || !dob || !phone || !role || !status || !email || !address || !gender || !department) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng điền tất cả các trường bắt buộc được đánh dấu bằng *.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Số điện thoại phải bắt đầu bằng số 0 và bao gồm 10 chữ số.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\.com$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Email phải bắt đầu bằng chữ hoặc số, không có ký tự đặc biệt và kết thúc bằng @gmail.com.',
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
        const response = await fetch('http://localhost:8080/api/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const text = await response.text();
            const result = text ? JSON.parse(text) : {};

            to = email;
            username = result.username;
            password = result.password;

            console.log('Success:', result);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Người dùng đã được thêm thành công.',
                confirmButtonText: 'OK'
            }).then(() => {
                sendEmail();
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

function returnUser() {
    window.location.href = 'user.html';
}
