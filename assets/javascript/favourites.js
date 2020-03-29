
//--------------------------------------------------------------------
//----------------------- global variables ---------------------------
//--------------------------------------------------------------------

const favouritedRecipes = retreiveFavourites();


//--------------------------------------------------------------------
//--------------------------- functions ------------------------------
//--------------------------------------------------------------------

function addToFavourites(){
    recipeToAdd = JSON.parse(localStorage.getItem("temp"));
    let add = true;
    recipeId = recipeToAdd.id
    Object.keys(favouritedRecipes).forEach(ID => {
        if(ID === recipeId){
            addToFavourites = false;
        }
    });
    if (add){
        favouritedRecipes[recipeId] = recipeToAdd;
        console.log(favouritedRecipes);
        localStorage.setItem("favourites",JSON.stringify(favouritedRecipes));
    }
}

function removeFromFavourites(){
    recipeToRemove = JSON.parse(localStorage.getItem("temp"));
    recipeId = recipeToRemove.id
    delete favouritedRecipes[recipeId]
    localStorage.setItem("favourites",JSON.stringify(favouritedRecipes));
}

function retreiveFavourites(){
    const favouritedRecipes = JSON.parse(localStorage.getItem("favourites"));
    if (favouritedRecipes===null){
        return {};
    } else {
        return favouritedRecipes;
    } 
}

function ADDtempfile(recipe){
    localStorage.setItem("temp",JSON.stringify(recipe))
}



//--------------------------------------------------------------------
//--------------------------- listeners ------------------------------
//--------------------------------------------------------------------
// $('.add-favourite-btn').click(prepareToAdd(event));

// $('.remove-favourite-btn').click(prepareToRemove(event));



//--------------------------------------------------------------------
//----------------------- global variables ---------------------------
//--------------------------------------------------------------------
