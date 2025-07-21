document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm"); // Refer to login.html

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Getting the form values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
        username: username,
        password: password,
      };   

      // Handle the APIs
      const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
          console.log("Login successful");
          if (responseData.token) {
            localStorage.setItem("token", responseData.token); // Store the token in local storage
          }
          alert(`Login Successful. Welcome to the game, ${username}!`)
          window.location.href = "index.html"; // Where you get to sent to after completing registration
          return;
        } else {
          console.error("Login failed:", responseData);
          alert(responseData.message || "Login failed. PLease try again");
        }
      };
      fetchMethod(currentUrl + "/api/login", callback, "POST", data);
    });
  });