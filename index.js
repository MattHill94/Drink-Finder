//  id's for elements 
const search = document.getElementById('search'),
    submit = document.getElementById("submit"),
    random = document.getElementById("random"),
    drinksEl = document.getElementById("drinks"),
    resultHeading = document.getElementById("result-heading"),
    single_drink = document.getElementById("single-drink");

// event listeners for search buttons 
submit.addEventListener("submit", searchDrink);
random.addEventListener("click", randomDrink);

// search drink function 
function searchDrink(e) {
    e.preventDefault();
    single_drink.innerHTML = "";
    const term = search.value;
    if (term.trim()) {
        // api endpoint ${term} is what the user will be searching for 
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
            .then((res) => res.json())
            .then((data) => {
                // what the user has searched
                resultHeading.innerHTML = `<h2> Search result of '${term}'</h2>`;
                if (data.drinks === null) {
                    // if the result hasnt resulted in anything
                    resultHeading.innerHTML = '<h2> There is no result. Please try again</h2>';
                } else {
                    // response from api 
                    drinksEl.innerHTML = data.drinks.map(
                            (drink) =>
                            `<div class="drink">
                            <img src="${drink.strDrinkThumb}"
                        alt="${drink.strDrink}">
                        <div class="drink-info"
                            data-drinkID="${drink.idDrink}">
                            <h3>${drink.strDrink}</h3>
                        </div>
                    </div>`
                        )
                        .join("");
                }
            });
        search.value = "";
    } else {
        resultHeading.innerHTML = "<h2> Please type in a cocktail or spirit </h2>";
    }
}

// function for pressing the random button next to search bar
function randomDrink() {
    drinksEl.innerHTML = "";
    resultHeading.innerHTML = "";
    // random drink api endpoint 
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then((res) => res.json())
        .then((data) => {
            const drink = data.drinks[0];
            addDrinkToDom(drink)
        });

}


// when clikcing on a drinks thumbnail returns drink-info 
drinksEl.addEventListener("click", (e) => {
    const drinkInfo = e.path.find((item) => {
        if (item.classList) {
            return item.classList.contains('drink-info');
        } else {
            return false;
        }
    });
    if (drinkInfo) {
        const drinkID = drinkInfo.getAttribute("data-drinkid");
        getDrinkByID(drinkID);
    }
});

// function for getting the drink by id needed to get the info for detailed view
function getDrinkByID(drinkID) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
        .then((res) => res.json())
        .then((data) => {
            const drink = data.drinks[0];
            addDrinkToDom(drink);
        });
}

// loops through ingredients to display all of them at the bottom of page
function addDrinkToDom(drink) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (drink[`strIngredient${i}`]) {
            ingredients.push(
                    `${drink[`strIngredient${i}`]}: ${drink[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

// detailed for of the drinks including thumbnails drink title and instructions 
single_drink.innerHTML = `<div class="single-drink">
      <h1>${drink.strDrink}</h1>
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
      <div class="single-drink-info">
          ${drink.strCategory ? `<p>${drink.strCategory}</p>` : ""}
      </div>
      <div class="main">
          <p>${drink.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
              ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
      </div>
  </div>`;
}