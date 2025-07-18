// Simple register form functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const signupBtn = document.querySelector('.signup-btn');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // Collect form data
        const userData = {
            username: username,
            email: email,
            password: password
        };

        console.log('Registration data:', userData);

        // Show loading state
        signupBtn.textContent = 'Signing up...';
        signupBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            alert('Registration successful!');
            form.reset();
            signupBtn.textContent = 'Signup';
            signupBtn.disabled = false;
        }, 1500);

        // Here you would typically send data to your backend
        /*
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Registration successful!');
            form.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        })
        .finally(() => {
            signupBtn.textContent = 'Signup';
            signupBtn.disabled = false;
        });
        */
    });
});