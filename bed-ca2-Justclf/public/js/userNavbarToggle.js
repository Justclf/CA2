document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");
  const questButton = document.getElementById("questbutton");
  const questProgressButton = document.getElementById("questProgressButton");
  const reportButton = document.getElementById("reportButton");
  const pvpButton = document.getElementById("pvpButton");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (token) {
    // Token exists, show profile button and hide login and register buttons
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");
    questProgressButton.classList.add("d-none");
    questButton.classList.add("d-none");
    reportButton.classList.add("d-none");
    pvpButton.classList.add("d-none");
    profileButton.classList.remove("d-none");
    logoutButton.classList.remove("d-none");
    questButton.classList.remove("d-none");
    questProgressButton.classList.remove("d-none");
    reportButton.classList.remove("d-none")
    pvpButton.classList.remove("d-none")
  } else {
    // Token does not exist, show login and register buttons and hide profile and logout buttons
    profileButton.classList.remove("d-none");
    logoutButton.classList.remove("d-none");
    questButton.classList.remove("d-none");
    questProgressButton.classList.remove("d-none");
    reportButton.classList.remove("d-none")
    pvpButton.classList.remove("d-none")
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");
    questProgressButton.classList.add("d-none");
    questButton.classList.add("d-none");
    reportButton.classList.add("d-none");
    pvpButton.classList.add("d-none");
  }

  logoutButton.addEventListener("click", function () {
    // Remove the token from local storage and redirect to index.html
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});