` 
<div class="card light-grey darken-1">
    <div class="card light-grey darken-1">
        <div class="row valign-wrapper">
            <div class="col s6 m4">
                <img src="https://via.placeholder.com/150" alt="" class="responsive-img">
            </div>
            <div class="col s6 m8">
                <span class="black-text">
                    <p id="recipename">
                        Title
                    </p>
                    <p class="recipetext">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid eos asperiores fugiat laudantium sunt doloribus necessitatibus quae suscipit inventore hic nam, recusandae, delectus magni mollitia. Sint iusto inventore suscipit aut.
                    </p>
                </span>
            </div> 
        </div>
    </div>               
</div>
`



//Clicking recipe in a list
$("#search-results").on("click", ".list-recipes", function(event) {
    console.log($(event.target).attr("data-id"));
    const recipeId = $(event.target).attr("data-id");
    //const recipes = event.currentTarget.innerText;
    const userKey = randomKey(); //api key
    const APIkey = "&apiKey=" + userKey;
    const IngURL =
      "https://api.spoonacular.com/recipes/" +
      recipeId +
      "/information?includeNutrition=false" +
      APIkey;
      ajaxRequest(IngURL,getFullRecipe);
});
    
    function getFullRecipe(response){
      console.log(response);
      const recipe = {
        title: response.title,
        id: response.id,
        img: response.image,
        servings: response.servings,
        prepTime: response.preparationMinutes,
        totalTime: response.readyInMinutes,
        ingredientList: response.extendedIngredients,
        methodList: response.analyzedInstructions[0].steps
      }

    for(const property in recipe){
      console.log(recipe[property]);
    }
    const recipeModal = createModal(recipe);
    $('body').append(recipeModal);
  }
  

function createModal (recipe) {
//---------------------- modal STRUCTURE -----------------------
    //define the modal box and buttons
    modalContainer = $('<div>').addClass("modal-container");
    modalBody = $('<div>').addClass("modal-body");
    buttonContainer = $('<div>').addClass("button-container");
    favouriteButton = $('<button>').addClass("favourite-button");
    heartIcon = $('<i>').addClass("fa fa-heart");
    shoppingCart = $('<button>').addClass("cart-button");
    cartIcon = $('<i>').addClass("fa fa-cart-plus");
    closeButton = $('<button>').addClass("close-button");
    closeIcon = $('<i>').addClass("fas fa-times");
        // assemble button container
        favouriteButton.append(heartIcon);
        shoppingCart.append(cartIcon);
        closeButton.append(closeIcon);
        buttonContainer.append(favouriteButton,shoppingCart,closeButton);
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
        prepTime.text("Prep: "+recipe.prepTime+" mins");
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

    //append the info and the image into the content Head
    contentHead.append(recipeIMG, headInfoContainer);

//----------------- content BODY ------------------------------------
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
            const nameExtended = name+": "+ingredient.original;
            if (ingredient.measures.metric.unitShort === ingredient.measures.us.unitShort){
                listItem.text(nameExtended);
            } else if (consistency === "solid" && ingredient.measures.metric.unitShort ==="ml"){
                listItem.text(nameExtended);
            } else {
                let amount = ingredient.measures.metric.amount;
                const units = ingredient.measures.metric.unitShort;
                amount = Math.round(amount);
                const metricName = name+": "+amount+units;
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
modalContainer.append(modalBody);

return modalContainer;
}


