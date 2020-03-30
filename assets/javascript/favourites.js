
//--------------------------------------------------------------------
//----------------------- global variables ---------------------------
//--------------------------------------------------------------------

const favouritedRecipes = retreiveFavourites();
$(document).ready(function(){
    displayFavourites();
});



//--------------------------------------------------------------------
//--------------------------- functions ------------------------------
//--------------------------------------------------------------------

function addToFavourites(){
    console.log("ADD TO FAVOURITES");
    const recipeToAdd = JSON.parse(localStorage.getItem("temp"));
    const recipeId = recipeToAdd.id

    if (!inFavourites(recipeId)){

        favouritedRecipes[recipeId] = recipeToAdd;
        localStorage.setItem("favourites",JSON.stringify(favouritedRecipes));
    }
}

function inFavourites(recipeId){
  let infavourites = false
    Object.keys(favouritedRecipes).forEach(ID => {
        if (ID == recipeId){
            infavourites = true
        }
    });

    return infavourites;
}

function removeFromFavourites(){
    console.log("REMOVE FROM FAVOURITES");
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




//--------------------------------------------------------------------
//--------------------- display favourites ---------------------------
//--------------------------------------------------------------------

function displayFavourites(){
    for (const recipes in favouritedRecipes){

        console.log(recipes);

        favouriteCard = $('<div>').addClass("favourite-card");
            favouriteCard.attr("id",recipes)

        favouriteTitle = $('<h6>').addClass("favourite-title"); 
            favouriteTitle.text(recipes.title)   

        favouriteImg = $('<img>').addClass("favourite-img")
            favouriteImg.attr("src",recipes.img);

        favouriteCard.append(favouriteTitle,favouriteImg);

        $('#favourites').append(favouriteCard);
    }
   
}
