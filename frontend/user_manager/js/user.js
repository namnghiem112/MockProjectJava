let  authToken = localStorage.getItem('authToken');
let  refreshToken = localStorage.getItem('refreshToken');
let currentPage = 0;
let totalPages = 0;
const pageSize = 10;
let searchTerm = '';
let selectedRole = '';
let department = localStorage.getItem('userDepartment');
let username = localStorage.getItem('username');

document.addEventListener("DOMContentLoaded", function() {
    loadUserList(0);
});

function addNewUser() {
    window.location.href = 'createuser.html';
}

function viewUserDetails(userId) {
    window.location.href = `userdetails.html?id=${userId}`;
}

async function loadUserList(page) {
    let url = `http://localhost:8080/api/user?page=${page}&size=${pageSize}`;
    
    if (searchTerm) {
        url += `&username=${encodeURIComponent(searchTerm)}`;
    }
    if (selectedRole) {
        url += `&role=${encodeURIComponent(selectedRole)}`;
    }

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

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        handleResponse(response);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleResponse(response) {
    if (response.ok) {
        const data = await response.json();
        totalPages = data.totalPages; 
        currentPage = data.number;
        displayUsers(data.content); 
        updatePagination(); 
    } else {
        const errorText = await response.text();
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Đã xảy ra lỗi: ' + errorText,
            confirmButtonText: 'OK'
        });
    }
}

function displayUsers(users) {
    const userListDiv = document.getElementById('user-list');
    userListDiv.innerHTML = ''; 

    users.forEach(user => {
        const userDiv = document.createElement('tr');
        userDiv.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>
                <button onclick="viewUserDetails('${user.id}')">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button onclick="editUser('${user.id}')">
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </td>
        `;
        userListDiv.appendChild(userDiv);
    });
}

function editUser(userID) {
    if (userID) { 
        window.location.href = `editUser.html?id=${userID}`;
    } else {
        console.error('User ID is not available.');
    }
}

function updatePagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const paginationInfo = document.getElementById('pagination-info');

    paginationInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

document.getElementById('prev-btn').addEventListener('click', function() {
    if (currentPage > 0) {
        loadUserList(currentPage - 1);
    }
});

document.getElementById('next-btn').addEventListener('click', function() {
    if (currentPage < totalPages - 1) {
        loadUserList(currentPage + 1);
    }
});

function searchUsers() {
    searchTerm = document.getElementById('search-input').value.trim();
    selectedRole = document.getElementById('role-select').value;
    loadUserList(0);  
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
            return data
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
