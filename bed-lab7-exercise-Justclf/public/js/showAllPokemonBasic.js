const callback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  const pokemonList = document.getElementById("pokemonList"); //pokemonList is located at index.html
  responseData.forEach((pokemon) => {
    const displayItem = document.createElement("div");
    displayItem.className =
      "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
    displayItem.innerHTML = `
        <div class="card">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.dex_num}.png" class="card-img-top" alt="Pokemon Image">
            <div class="card-body">
                <h5 class="card-title">ID: ${pokemon.id}</h5>
                <p class="card-text"> 
                    ATK: ${pokemon.atk} <br> 
                    DEF: ${pokemon.def} <br> 
                    HP: ${pokemon.hp} <br> 
                    Owner ID: ${pokemon.owner_id} <br> 
                </p>
                <a href="singlePlayerInfo.html?player_id=${pokemon.owner_id}" class="btn btn-primary">View Owner</a>
            </div>
        </div>
        `;
    pokemonList.appendChild(displayItem);
  });
};

fetchMethod(currentUrl + "/api/pokemon", callback);