let authToken = localStorage.getItem('authToken');
let refreshToken = localStorage.getItem('refreshToken');
let userID = null;

function returnUser() {
    window.location.href = 'user.html';
}

function editUser() {
    if (userID) {
        window.location.href = `editUser.html?id=${userID}`;
    } else {
        console.error('User ID is not available.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    userID = urlParams.get('id');

    if (userID) {
        fetchUserDetails(userID);
    }

    var modal = document.getElementById("banModal");
    var btn = document.querySelector(".ban-button");
    var closeBtn = document.querySelector(".close");
    var cancelBtn = document.querySelector(".cancel-ban");
    var confirmBtn = document.querySelector(".confirm-ban");

    var actionType = '';

    btn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    window.addEventListener("click", outsideClick);

    function openModal() {
        modal.style.display = "block";
        actionType = getActionTypeFromButton();
        updateModalText(actionType);
    }

    function closeModal() {
        modal.style.display = "none";
    }

    function outsideClick(e) {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    }

    confirmBtn.addEventListener("click", function () {  
        if (userID && actionType) {
            performAction(userID, actionType);
        }
        closeModal();
    });

    function getActionTypeFromButton() {
        return document.querySelector('.btn_banCandidate').textContent.includes('Activate') ? 'activate' : 'inactivate';
    }

    function updateModalText(actionType) {
        var message = actionType === 'inactivate'
            ? "Are you sure you want to inactivate this candidate?"
            : "Are you sure you want to activate this candidate?";
        document.querySelector(".modal-content p").textContent = message;
    }

    async function performAction(userID, actionType) {
        try {
            if ( isTokenExpired(authToken)) {
                const tokens = await refreshAuthToken();
                if (tokens) {
                    authToken = tokens.accessToken;
                    refreshToken = tokens.refreshToken;
                    localStorage.setItem('authToken', authToken);
                    localStorage.setItem('refreshToken', refreshToken);
                } else {
                    window.location.href = '../auth/login.html';
                    return;
                }
            }

            const apiEndpoint = actionType === 'inactivate'
                ? `http://localhost:8080/api/user/inactivate/${userID}`
                : `http://localhost:8080/api/user/activate/${userID}`;

            const response = await fetch(apiEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert("Error performing action.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error performing action.");
        }
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
                    window.location.href = '../auth/login.html';
                    return;
                }
            }

            const response = await fetch(`http://localhost:8080/api/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                displayUserDetails(data);
            } else {
                console.error('Error fetching user details:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayUserDetails(user) {
        document.getElementById('fullname').textContent = user.fullname || 'N/A';
        document.getElementById('dob').textContent = user.dob || 'N/A';
        document.getElementById('phone').textContent = user.phone || 'N/A';
        document.getElementById('role').textContent = user.role || 'N/A';
        document.getElementById('status').textContent = user.status || 'N/A';
        document.getElementById('email').textContent = user.email || 'N/A';
        document.getElementById('address').textContent = user.address || 'N/A';
        document.getElementById('gender').textContent = user.gender || 'N/A';
        document.getElementById('department').textContent = user.department || 'N/A';
        document.getElementById('note').textContent = user.note || 'N/A';
        const banButton = document.querySelector('.btn_banCandidate');
        if (user.status === 'ACTIVE') {
            banButton.classList.add('active');
            banButton.classList.remove('inactive');
            banButton.textContent = 'De-activate User';
        } else {
            banButton.classList.add('inactive');
            banButton.classList.remove('active');
            banButton.textContent = 'Activate User';
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
});
