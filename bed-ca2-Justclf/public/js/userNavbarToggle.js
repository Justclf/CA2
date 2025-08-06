document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");
  const questButton = document.getElementById("questButton");
  const questProgressButton = document.getElementById("questProgressButton");
  const reportButton = document.getElementById("reportButton");
  const pvpButton = document.getElementById("pvpButton");
  const reportButton2 = document.getElementById("report2Button");
  const indexQuest = document.getElementById("indexquest")
  const indexStart = document.getElementById("indexstart")
  const indexVuln = document.getElementById("indexvuln")

  // Check if token exists in local storage
  const token = localStorage.getItem("token");
   if (token) {
    // Token exists, show profile button and hide login and register buttons
    loginButton && loginButton.classList.add("d-none");
    registerButton && registerButton.classList.add("d-none");
    indexStart && indexStart.classList.add("d-none");
    profileButton && profileButton.classList.remove("d-none");
    logoutButton && logoutButton.classList.remove("d-none");
    questButton && questButton.classList.remove("d-none");
    questProgressButton && questProgressButton.classList.remove("d-none");
    reportButton && reportButton.classList.remove("d-none");
    pvpButton && pvpButton.classList.remove("d-none");
    reportButton2 && reportButton2.classList.remove("d-none");
    
  } else {
    // Token does not exist, show login and register buttons and hide profile and logout buttons
    loginButton && loginButton.classList.remove("d-none");
    registerButton && registerButton.classList.remove("d-none");
    profileButton && profileButton.classList.add("d-none");
    logoutButton && logoutButton.classList.add("d-none");
    questButton && questButton.classList.add("d-none");
    questProgressButton && questProgressButton.classList.add("d-none");
    reportButton && reportButton.classList.add("d-none");
    pvpButton && pvpButton.classList.add("d-none");
    reportButton2 && reportButton2.classList.add("d-none");
    indexQuest && indexQuest.classList.add("d-none");
    indexVuln && indexVuln.classList.add("d-none");
  }

  logoutButton.addEventListener("click", function () {
    // Remove the token from local storage and redirect to index.html
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});