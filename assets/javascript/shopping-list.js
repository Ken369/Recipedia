
function addToIngredientList(){
    let ingredientList = JSON.parse(localStorage.getItem("ingredientList"));
    if (ingredientList === null||ingredientList === undefined){
        ingredientList ={};
    } 
    console.log(ingredientList);
    const recipe = JSON.parse(localStorage.getItem("temp"));
    console.log(recipe);

    const ingredients = recipe.ingredientList;
    console.log(ingredients);
    ingredientList[recipe.id] = ingredients;
    localStorage.setItem("ingredientList",JSON.stringify(ingredientList));
}

function removeFromIngredientList(){
    let ingredientList = JSON.parse(localStorage.getItem("ingredientList"));
    console.log(ingredientList);
    const recipe = JSON.parse(localStorage.getItem("temp"));
    delete ingredientList[recipe.id];
    localStorage.setItem("ingredientList",JSON.stringify(ingredientList));
}

function inIngredientList(recipeId){
    ingredientList = JSON.parse(localStorage.getItem("ingredientList"))
    let inIngredientList = false
      Object.keys(inIngredientList).forEach(ID => {
          if (ID == recipeId){
              inIngredientList = true
          }
      });
  
      return inIngredientList;
  }


async function combineShoppingList(){
    let ingredientList = JSON.parse(localStorage.getItem("ingredientList"));
    const shoppingList = {};
    for (const property in ingredientList){
        ingredients = ingredientList[property];
        console.log(ingredients);
       await Promise.all(ingredients.map(async ingredient => {
            
            let aisle = ingredient.aisle
            if (ingredient.aisle === "Produce;Spices and Seasonings" && ingredient.name.indexOf("fresh")!==-1){
                aisle = "Produce";
            }

            let aisleExist = false;
            for (const property in shoppingList){
                if (property === ingredient.aisle){
                    aisleExist = true;
                }
            } 
            console.log(aisle);
            console.log(aisleExist);
            if (aisleExist){
                console.log("Aisle does exist, go into this aisle");
                const aisle = ingredient.aisle
                let ingredientExist = false
                for (const ingredients in shoppingList[aisle]){
                    if (ingredients === ingredient.name){
                        ingredientExist = true;
                    }
                } 
                console.log(ingredientExist);
                if (ingredientExist){
                    console.log("Already Exists Adding");
                    const name = ingredient.name
                    let shoppingAmount = shoppingList[aisle][name].amount;
                    let shoppingUnit = shoppingList[aisle][name].unit;
                    const ingredientAmount = ingredient.measures.metric.amount;
                    let ingredientUnit = ingredient.measures.metric.unitLong;
                    console.log(ingredientUnit);
                    console.log(shoppingUnit);
                    console.log(ingredientUnit === shoppingUnit);
                    if (ingredientUnit === shoppingUnit){ //if units are the same, great add them
                        shoppingAmount+=ingredientAmount;
                        shoppingList[aisle][name].amount = shoppingAmount;
                    } else { //if not
                        console.log(shoppingAmount); //before
                        const convertedUnit = await convertUnits(shoppingUnit,ingredientUnit,ingredientAmount,name); //ajax function
                        shoppingAmount += convertedUnit; //adds to exisitng amount
                        console.log(shoppingAmount); //after
                        shoppingList[aisle][name].amount = shoppingAmount; //updates the object with new amount
                    }

                } else {
                    console.log(ingredient.name);
                    shoppingList[aisle][ingredient.name] ={};
                    shoppingList[aisle][ingredient.name].amount = ingredient.measures.metric.amount;
                    shoppingList[aisle][ingredient.name].unit = ingredient.measures.metric.unitLong;
                    console.log(shoppingList[aisle][ingredient.name]);
                }
                
            } else {
                shoppingList[ingredient.aisle] = {};
                shoppingList[ingredient.aisle][ingredient.name] ={};
                shoppingList[ingredient.aisle][ingredient.name].amount = ingredient.measures.metric.amount;
                shoppingList[ingredient.aisle][ingredient.name].unit = ingredient.measures.metric.unitLong;
                console.log(shoppingList[ingredient.aisle][ingredient.name]);
            }
        }));
    console.log(shoppingList);
    }
    return shoppingList
}


function convertUnits(shoppingUnit,ingredientUnit,ingredientAmount,name){
    console.log(name);
    const userKey = randomKey(); //api key
    const APIkey = "&apiKey=" + userKey; //
    const convertEndpoint = "https://api.spoonacular.com/recipes/convert?ingredientName="+name+"&sourceAmount="+ingredientAmount+"&sourceUnit="+ingredientUnit+"&targetUnit="+shoppingUnit+APIkey;
    return $.ajax({
        url: convertEndpoint,
        method: "GET"
      }).then(function(response){
            convertedAmount = response.targetAmount;
            console.log(convertedAmount);
            console.log(response.answer);
            return convertedAmount;
      });
}


//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------- SHOPPING LIST CREATION UPON CLICKING CART ----------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

async function openShoppingCart(){
    const shoppingList = await combineShoppingList();
    console.log(shoppingList);
    shoppingModal =  displayShoppingList(shoppingList);
    $('#modal-goes-here').append(shoppingModal);
}


function displayShoppingList(shoppingList){
    modalContainer = $('<div>').addClass("modal-container");
    shoppingBody = $('<div>').addClass("shopping-body");
    title = $('<h4>').addClass("shopping-title");
    title.text("Shopping List");
    //close button
    closeButton = $('<button>').addClass("close-button");
        closeButton.attr("id","close-window")
    closeIcon = $('<i>').addClass("fas fa-times");
        closeIcon.attr("id","close-icon")
    closeButton.append(closeIcon); //append icon to button

    shoppingBody.append(closeButton,title); //append button and title to body

    for (const aisles in shoppingList){
        aisleContainer = $('<div>').addClass("aisle-container");
        aisleTitle = $('<h6>').addClass("aisle-title");
            aisleTitle.text(aisles);
        listContainer = $('<ul>').addClass("list-container")

        for (const ingredients in shoppingList[aisles]){
            console.log(ingredients);
            listItem = $('<li>').addClass("list-item");

            let itemAmount = shoppingList[aisles][ingredients].amount;

            if (itemAmount > 5){
                itemAmount = Math.round(itemAmount)
            } else {
                itemAmount = itemAmount.toPrecision(2);
            }

            listItem.text(ingredients+ ":  "+itemAmount+" "+ shoppingList[aisles][ingredients].unit);
            listContainer.append(listItem);
        }
        aisleContainer.append(aisleTitle,listContainer); 
        shoppingBody.append(aisleContainer);
    }
    modalContainer.append(shoppingBody);  
    return modalContainer;
}