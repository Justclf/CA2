// // Simple register form functionality
// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('registerForm');
//     const signupBtn = document.querySelector('.signup-btn');
// 
//     // Form submission
//     form.addEventListener('submit', function(e) {
//         e.preventDefault();
//         
//         // Get form values
//         const username = document.getElementById('username').value;
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         const confirmPassword = document.getElementById('confirmPassword').value;
// 
//         // Basic validation
//         if (!username || !email || !password || !confirmPassword) {
//             alert('Please fill in all fields');
//             return;
//         }
// 
//         if (password !== confirmPassword) {
//             alert('Passwords do not match');
//             return;
//         }
// 
//         if (password.length < 6) {
//             alert('Password must be at least 6 characters long');
//             return;
//         }
// 
//         // Collect form data
//         const userData = {
//             username: username,
//             email: email,
//             password: password
//         };
// 
//         console.log('Registration data:', userData);
// 
//         // Show loading state
//         signupBtn.textContent = 'Signing up...';
//         signupBtn.disabled = true;
// 
//         // Simulate API call
//         setTimeout(() => {
//             alert('Registration successful!');
//             form.reset();
//             signupBtn.textContent = 'Signup';
//             signupBtn.disabled = false;
//         }, 1500);
// 
//         // Here you would typically send data to your backend
//         /*
//         fetch('/api/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//             alert('Registration successful!');
//             form.reset();
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             alert('Registration failed. Please try again.');
//         })
//         .finally(() => {
//             signupBtn.textContent = 'Signup';
//             signupBtn.disabled = false;
//         });
//         */
//     });
// });



document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Perform signup logic
    if (password === confirmPassword) {
      // Passwords match, proceed with signup
      console.log("Signup successful");
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);
      warningCard.classList.add("d-none");

      const data = {
        username: username,
        email: email,
        password: password,
      };

      const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
          // Check if signup was successful
          if (responseData.token) {
            // Store the token in local storage
            localStorage.setItem("token", responseData.token);
          }
            // Redirect or perform further actions for logged-in user
            window.location.href = "profile.html";
            return;
          }
        // otherwise show error
        warningCard.classList.remove("d-none");
        warningText.innerText = responseData.message;
      };

      // Perform signup request
      fetchMethod(currentUrl + "/api/register", callback, "POST", data);

      // Reset the form fields
      signupForm.reset();
    } else {
      // Passwords do not match, handle error
      warningCard.classList.remove("d-none");
      warningText.innerText = "Passwords do not match";
    }
  });
}); 