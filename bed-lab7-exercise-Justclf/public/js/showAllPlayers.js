document.addEventListener("DOMContentLoaded", function () {
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const playerList = document.getElementById("playerList");
    responseData.forEach((player) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${player.name}</h5>
                <p class="card-text">
                    Level: ${player.level}
                </p>
                <a href="singlePlayerInfo.html?player_id=${player.id}" class="btn btn-primary">View Details</a>
            </div>
        </div>
        `;
      playerList.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + "/api/player", callback);
});