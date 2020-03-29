
//------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------- MODAL CREATION UPON CLICKING A CARD ---------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

//Clicking recipe in a list
function expandRecipe(clickedItem){
    console.log(clickedItem);
    let recipeId = null;
    if (clickedItem.is('.result-card')){
        console.log(clickedItem.attr("id"));
        recipeId = clickedItem.attr("data-id");
    } else if (clickedItem.parent().is('.result-card')){
        console.log(clickedItem.parent('.result-card').attr("id"));
        recipeId = clickedItem.parent('.result-card').attr("id");
    }
   
    //const recipes = event.currentTarget.innerText;
    const userKey = randomKey(); //api key
    const APIkey = "&apiKey=" + userKey;
    const IngURL =
      "https://api.spoonacular.com/recipes/" +
      recipeId +
      "/information?includeNutrition=false" +
      APIkey;
      ajaxRequest(IngURL,displayFullRecipe);
}
    
    function displayFullRecipe(response){
      console.log(response);
      const recipe = {
        title: response.title,
        id: response.id,
        dietTags:{
            vegetarian:{status:response.vegetarian,displayText:"Vegetarian"},
            glutenFree:{status:response.glutenFree,displayText:"Gluten free"},
            vegan:{status:response.vegan,displayText:"Vegan"},
            dairyFree:{status:response.dairyFree,displayText:"Dairy free"},
            lowFodmap:{status:response.lowFodmap,displayText:"Low fodmap"},
        },
        img: response.image,
        servings: response.servings,
        prepTime: response.preparationMinutes,
        totalTime: response.readyInMinutes,
        ingredientList: response.extendedIngredients,
        methodList: response.analyzedInstructions[0].steps
      }

      ADDtempfile(recipe); // saves a temp copy in local under the key "temp"
      //creates the modal
    const recipeModal = createModal(recipe);
    
    //append modal to #modal-goes-here 
    $('#modal-goes-here').append(recipeModal);
  }
  

function createModal (recipe) {
//---------------------- modal STRUCTURE -----------------------
    //define the modal box and buttons
    modalContainer = $('<div>').addClass("modal-container");
    modalBody = $('<div>').addClass("modal-body");

    
//-----------------------Content HEADER--------------------------
    // define the content head and it's components
    contentHead = $('<section>').addClass("content-head");
    recipeIMG = $('<img>').addClass("recipe-image");
    headInfoContainer = $('<div>').addClass("head-info-container");
    title = $('<h3>').addClass("header-title");
        // fill out
        recipeIMG.attr('src',recipe.img);
        title.text(recipe.title);
        title.attr("id",recipe.id);

    //create the servings content
    servingContainer = $('<div>').addClass("serving-container");
    servings = $('<h5>').addClass("servings");
    userPlusIcon = $('<i>').addClass("fa fa-user-plus");
        // fill out and append
        servings.text("Serves: "+recipe.servings);
        servingContainer.append(servings,userPlusIcon);

    //Create the time content
    timeContainer = $('<div>').addClass("time-container");
    totalBar = $('<div>').addClass("total-bar");
    prepBar = $('<div>').addClass("prep-bar");
    timeInfoContainer = $('<div>').addClass("time-info-container");
    prepTime = $('<h5>').addClass("prep-time");
    totalTime = $('<h5>').addClass("total-time");
    stopwatchIcon = $('<i>').addClass("fas fa-stopwatch");
        //define the content of these components
        if (recipe.prepTime !== undefined ){
            prepTime.text("Prep: "+recipe.prepTime+" mins");
        }
        totalTime.text("Total: "+recipe.totalTime+" mins");
        timeInfoContainer.append(prepTime,stopwatchIcon,totalTime);
        timeContainer.append(timeInfoContainer);
        //set width of prep-bar for effect
        prepTimePercent = (recipe.prepTime/recipe.totalTime)*100;
        prepBar.css("width", prepTimePercent+"%");
        totalBar.append(prepBar);
        timeContainer.append(totalBar);
    //append these blocks to the headInfoContainer
    headInfoContainer.append(title, servingContainer,timeContainer)

    //create the diet tags
    dietTagContainter = $('<div>').addClass("diet-tag-container");
    // loop through all tags, if any of them are true, create a tag with the key name
    for (const tag in recipe.dietTags){

        if (recipe.dietTags[tag].status){
            tagItem = $('<span>').addClass("diet-tag");
            tagItem.text(recipe.dietTags[tag].displayText);
            dietTagContainter.append(tagItem);
        }
    }
    //create a further container for the img and the headInfoContainer
    subHeadContainer = $('<div>').addClass("sub-head-container");
    subHeadContainer.append(recipeIMG,headInfoContainer);
    //append the info and the image into the content Head
    contentHead.append(subHeadContainer,dietTagContainter);

//----------------- content BODY ------------------------------------
//creates modal-favourite, add-to-cart and close-window buttons
buttonContainer = $('<div>').addClass("button-container");
favouriteButton =  $('<button>');

favouriteText = $('<span>').addClass("favourite-text");
favouriteText.attr("id","favourite-button-text")
heartIcon = $('<i>').addClass("fa fa-heart");
cartButton =  $('<button>').addClass("cart-button");
cartText = $('<span>').addClass("cart-text");
cartIcon = $('<i>').addClass("fa fa-cart-plus");
closeButton = $('<button>').addClass("close-button");
closeButton.attr("id","close-window")
closeIcon = $('<i>').addClass("fas fa-times");
closeIcon.attr("id","close-icon")
    console.log(inFavourites(recipe.id));
    // assemble button container
    if (inFavourites(recipe.id)){
        favouriteButton.addClass("remove-favourite-button");
        favouriteText.text("remove from favourites");
    } else {
        favouriteButton.addClass("add-favourite-button");
        favouriteText.text("save to favourites");
    }
    cartText.text("Ingredients -> ");
    favouriteButton.append(favouriteText, heartIcon);
    cartButton.append(cartText, cartIcon);
    closeButton.append(closeIcon);
    buttonContainer.append(favouriteButton, cartButton);
    modalBody.append(closeButton)
    //define the content body and it's components
    contentBody = $('<section>').addClass("content-body");
    ingredientContainer = $('<div>').addClass("list-group ingredient-container");
    methodContainer = $('<div>').addClass("list-group method-container");
    ingredientTitle = $('<h4>').addClass('list-title');
    ingredientTitle.text("Ingredients")
    methodTitle = $('<h4>').addClass("list-title");
    methodTitle.text("Method");

    //append titles to containers
    ingredientContainer.append(ingredientTitle);
    methodContainer.append(methodTitle);

    //create the lists to be filled out
    ingredientList = $('<ul>').addClass("list-body");
    methodList = $('<ol>').addClass("list-body");
        //define the content of these components
        //fill out ingredient list by looping through ingredients.
        recipe.ingredientList.forEach(ingredient => {
            const listItem = $('<li>');
            const name = ingredient.name;
            const consistency = ingredient.consistency;
            if (ingredient.measures.metric.unitShort === ingredient.measures.us.unitShort){
                listItem.text("- "+ingredient.original);
            } else if (consistency === "solid" && ingredient.measures.metric.unitShort ==="ml"){
                listItem.text(ingredient.original);
            } else {
                let amount = ingredient.measures.metric.amount;
                const units = ingredient.measures.metric.unitShort;
                amount = Math.round(amount);
                const metricName = "- "+name+": "+amount+units;
                listItem.text(metricName);
            }
            ingredientList.append(listItem);
        });
        //fill out method list by lopping through the steps
        recipe.methodList.forEach(step => {
            listItem = $('<li>');
            listItem.text(step.step);
            methodList.append(listItem);
        });
        
        //append the lists to their containers
        ingredientContainer.append(ingredientList);
        methodContainer.append(methodList);

    //append containers to the contentBody
    contentBody.append(ingredientContainer,methodContainer);

//append the content head and body to the modalbody
modalBody.append(buttonContainer, contentHead, contentBody);

//finally append all to the modalContainer
modalContainer.prepend(modalBody)

return modalContainer;
}

