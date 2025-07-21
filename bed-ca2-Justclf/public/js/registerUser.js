document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm"); // Refer to register.html

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Getting the form values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    
    if (password != confirmPassword) {
      alert("Password do not match");
      return
    }

    if (password.length < 6) {
      alert("Password must be 6 characters long");
      return;
    }
    
    const validEmail = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (validEmail.test(email)) {
      alert("Please enter a valid email address");
      return
    }

    const data = {
        username: username,
        email: email,
        password: password,
      };   

      // Handle the APIs, Removed the token storing to prevent logging in immediatly
      const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
          alert(`Registration Successful.`)
          window.location.href = "login.html"; // Where you get to sent to after completing registration
          return;
        } else {
          console.error("Registration failed:", responseData);
          alert(responseData.message || "Registration failed. PLease try again");
        }
      };
      fetchMethod(currentUrl + "/api/register", callback, "POST", data);
    });
  });