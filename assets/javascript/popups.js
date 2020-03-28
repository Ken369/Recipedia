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

const recipe = {
    title:null,
    img:null,
    servings:null,
    prepTime:null,
    cookTime:null,
    totalTime:null,
    ingredientList:null,
    methodList:null
}




function createModal (recipe) {
//---------------------- modal STRUCTURE -----------------------
    //define the modal box and buttons
    modalContainer = $('<div>').addClass("modal-container");
    modalBody = $('<div>').addClass("modal-body");
    buttonContainer = $('<div>').addClass("button-container");
    favouriteButton = $('<button>').addClass("favourite-button");
    heartIcon = $('<i>').addClass("fas fa-heart");
    shoppingCart = $('<button>').addClass("cart-button");
    cartIcon = $('<i>').addClass("fas fa-cart-plus");
        // assemble button container
        favouriteButton.append(heartIcon);
        shoppingCart.append(cartIcon);
        buttonContainer.append(favouriteButton,shoppingCart);
//-----------------------Content HEADER--------------------------
    // define the content head and it's components
    contentHead = $('<section>').addClass("content-head");
    recipeIMG = $('<img>').addClass("recipe-image");
    headInfoContainer = $('<div>').addClass("head-info-container");
    title = $('<h3>').addClass("header-title");
        // fill out
        recipeIMG.attr('src',recipe.img);
        title.text(recipe.title);

    //create the servings content
    servingContainer = $('<div>').addClass("serving-container");
    servings = $('<h5>').addClass("servings");
    userPlusIcon = $('<i>').addClass("fas fa-user-plus");
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
        prepTimePercent = (recipe.prepTime/recipe.totalTime);
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
    ingredientContainer = $('<div>').addClass("list-group");
    methodContainer = $('<div>').addClass("list-group");
    ingredientTitle = $('<h4>').addClass('list-title');
    ingredientTitle.text("Ingredients")
    methodTitle = $('<h4>').addClass("list-title");
    methodTitle.text("Method");

    //append titles to containers
    ingredientContainer.append(ingredientTitle);
    methodContainer.append(methodTitle);

    //create the lists to be filled out
    ingredientList = $('<ul>').addClass("list-body");
    methodList = $('<ul>').addClass("list-body");
        //define the content of these components
        //fill out ingredient list by looping through ingredients.
        reicpe.ingredientList.forEach(ingredient => {
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


