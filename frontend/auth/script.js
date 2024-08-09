document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;

    fetch('http://localhost:8080/api/auth/forgot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: email
    })
        .then(response => {
            if (response.status === 401) {
                // Handle 401 Unauthorized
                return response.json().then(data => {
                    console.error('Unauthorized:', data);
                    alert('Email address does not exist.');
                });
            } else if (response.ok) {
                // Handle successful response
                return response.json().then(data => {
                    console.log('Success:', data);
                    alert('A reset link has been sent to your email.');
                    $('#forgotPasswordModal').modal('hide'); // Hide the modal
                });
            } else {
                // Handle other response statuses
                return response.json().then(data => {
                    console.error('Error:', data);
                    alert('An error occurred. Please try again.');
                });
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
            alert('Failed to send reset link. Please try again.');
        });
});
