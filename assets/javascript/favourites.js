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

function addToFavourites() {
  console.log("ADD TO FAVOURITES");
  const recipeToAdd = JSON.parse(localStorage.getItem("temp"));
  const recipeId = recipeToAdd.id;

  if (!inFavourites(recipeId)) {
    favouritedRecipes[recipeId] = recipeToAdd;
    localStorage.setItem("favourites", JSON.stringify(favouritedRecipes));
  }
}

function inFavourites(recipeId) {
  let infavourites = false;
  Object.keys(favouritedRecipes).forEach(ID => {
    if (ID == recipeId) {
      infavourites = true;
    }
  });

  return infavourites;
}

function removeFromFavourites() {
  console.log("REMOVE FROM FAVOURITES");
  recipeToRemove = JSON.parse(localStorage.getItem("temp"));
  recipeId = recipeToRemove.id;
  delete favouritedRecipes[recipeId];
  localStorage.setItem("favourites", JSON.stringify(favouritedRecipes));
}

function retreiveFavourites() {
  const favouritedRecipes = JSON.parse(localStorage.getItem("favourites"));
  if (favouritedRecipes === null) {
    return {};
  } else {
    return favouritedRecipes;
  }
}

function ADDtempfile(recipe) {
  localStorage.setItem("temp", JSON.stringify(recipe));
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

       const favouriteCard = $('<div>').addClass("card light-grey darken-1");
            favouriteCard.attr("id",recipes);

       const wrapper = $('<div>').addClass("row valign-wrapper");

        const imgWrapper =  $('<img>').addClass("col s2");
        const favouriteImg = $('<img>').addClass("circle responsive-img");
            favouriteImg.attr("src",recipes.img);
        imgWrapper.append(favouriteImg);    

        const titleWrapper = $('<div>').addClass("col s10"); 
        favouriteTitle = $('<span>').addClass("black-text"); 
            favouriteTitle.text(recipes.title); 
        titleWrapper.append(favouriteTitle);  

        wrapper.append(imgWrapper,titleWrapper);

        favouriteCard.append(wrapper);

        $('#favourites').append(favouriteCard);
    }
   
}


/* <div class="card light-grey darken-1">
<div class="row valign-wrapper">
  <div class="col s2">
    <img
      src="https://via.placeholder.com/150"
      alt=""
      class="circle responsive-img"
    />
  </div>
  <div class="col s10">
    <span class="black-text">Chicken Parma </span>
  </div>
</div>

<div class="card light-grey darken-1">
  <div class="row valign-wrapper">
    <div class="col s2">
      <img
        src="https://via.placeholder.com/150"
        alt=""
        class="circle responsive-img"
      />
    </div>
    <div class="col s10">
      <span class="black-text">Chicken Parma</span>
    </div>
  </div>
</div> */