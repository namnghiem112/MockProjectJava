let token = localStorage.getItem('authToken');
let uslg = localStorage.getItem('username');

function logout() {

    fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token  
        },
        body: JSON.stringify({ username: uslg })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userDepartment');
        window.location.href = '../auth/login.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const department = localStorage.getItem('userDepartment');
    const usernameSpan = document.querySelector('.us');
    const departmentSpan = document.querySelector('.dp');
    usernameSpan.innerHTML = `<i class="fa-solid fa-user"></i> ${username || 'Guest'}`;
    departmentSpan.innerHTML = `<i class="fa-solid fa-building"></i> ${department || 'N/A'}`;
});

