const callback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  const pokedexList = document.getElementById("pokedexList"); //pokedexList is located at pokedex.html
  responseData.forEach((pokedex) => {
    const displayItem = document.createElement("div");
    displayItem.className =
      "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
    displayItem.innerHTML = `
        <div class="card">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedex.number}.png" class="card-img-top" alt="Pokemon Image">
            <div class="card-body">
                <h5 class="card-title">ID: ${pokedex.name}</h5>
                <p class="card-text">
                    Number: ${pokedex.number} <br>  
                    Type 1: ${pokedex.type1} <br> 
                    Type 2: ${pokedex.type2} <br>
                </p>
            </div>
        </div>
        `;
    pokedexList.appendChild(displayItem);
  });
};

fetchMethod(currentUrl + "/api/pokedex", callback);