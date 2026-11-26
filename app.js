const mainDiv = document.querySelector("main");

const searchButton = document.getElementById("searchbutton");
const ingredientInput = document.getElementById("ingredientInput");
const randomButton = document.getElementById("randombutton");

searchButton.addEventListener("click", () => {
    const recipe = ingredientInput.value;
    searchFood(recipe);
});

randomButton.addEventListener("click", () => searchRandomFood());

function searchRecipe(id)
{
    mainDiv.innerHTML = "";
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data =>
        {
            console.log("Food ID: " + id);
            console.log(data);

            const meal = data.meals[0];
            
            mainDiv.insertAdjacentHTML("beforeend", `<img class="food-image" src=${meal.strMealThumb}>
                                                    <h1 class="food-title">${meal.strMeal}</h1>
                                                    <h2>${meal.strCategory}</h2>
                                                    <h2 class="food-origin">Origin: ${meal.strCountry}</h2>
                                                    <h3>Recipe: </h3>
                                                    <div id="recipe-table">
                                                    </div>`);

            let tableText = "";
            for(let i = 1; i <= 20; i++)
            {
                if((meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") && (meal[`strMeasure${i}`] && meal[`strMeasure${i}`].trim() !== ""))
                {
                    tableText +=   `<tr>
                                        <td>${meal[`strIngredient${i}`]}</td>
                                        <td>${meal[`strMeasure${i}`]}</td>
                                    </tr>`
                }

                if(tableText !== "")
                {
                    document.getElementById("recipe-table").innerHTML = `<table style="width: 50%;">
                                                                            <tr>
                                                                                <th>Ingredients</th>
                                                                                <th>Measurements</th>
                                                                            </tr>
                                                                            ${tableText}
                                                                        </table>
                                                                        <h3 id="instructions"></h3>`;
                }
            }

            document.getElementById("instructions").innerHTML = meal.strInstructions;
            
            return data;
        })
        .catch(err => {
            console.error(err);
            mainDiv.insertAdjacentHTML("beforeend", "<h1>Try Again!</h1>")
        });
}

function searchFood(rec)
{
    return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${rec}`)
        .then(res => res.json())
        .then(data => 
        {
            console.log(data);
            mainDiv.innerHTML = "";
            for(const meal of data.meals)
            {
                mainDiv.insertAdjacentHTML("beforeend", `<button class="food-button" onclick="searchRecipe(${meal.idMeal})">
                                                        <h1>${meal.strMeal}</h1>
                                                        <p>Origin: ${meal.strCountry}</p>
                                                        <img src=${meal.strMealThumb}>
                                                        </button>`);
            }
        })
        .catch(err => console.log(err));
}

function searchRandomFood()
{
    console.log("Getting random food...");
    return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(res => res.json())
        .then(data => searchRecipe(data.meals[0].idMeal))
        .catch(error => console.log(error));
}