$(document).ready(function(){
//--------------------------------------------------------------------
//----------------------- global variables ---------------------------
//--------------------------------------------------------------------

const favouritedRecipes = retreiveFavourites();


//--------------------------------------------------------------------
//--------------------------- functions ------------------------------
//--------------------------------------------------------------------

function addToFavourites(recipeId,recipeTitle,recipeImageSRC){
    let add = true;
    Object.keys(favouritedRecipes).forEach(ID => {
        if(ID === recipeId){
            addToFavourites = false;
        }
    });
    if (add){
        favouritedRecipes[recipeId] = {title:recipeTitle,imageSRC:recipeImageSRC}
        localStorage.setItem("favourites",JSON.stringify(favouritedRecipes));
    }
   
}

function removeFromFavourites(recipeId){
    delete favouritedRecipes[recipeId]
    localStorage.setItem("favourites",JSON.stringify(favouritedRecipes));
}


function prepareToAdd(event){
    buttonElement = $(event.target);
    addToFavourites(recipeId,recipeTitle,recipeImageSRC);

}

function prepareToRemove(event){
   buttonElement = $(event.target);
    removeFromFavourites(recipeId);
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
    localStorage.setItem("temp",JSON.stringify(recipe));
}

function DELETEtempfile(){

}


//--------------------------------------------------------------------
//--------------------------- listeners ------------------------------
//--------------------------------------------------------------------
$('.add-favourite-btn').click(prepareToAdd(event));

$('.remove-favourite-btn').click(prepareToRemove(event));



//--------------------------------------------------------------------
//----------------------- global variables ---------------------------
//--------------------------------------------------------------------
});