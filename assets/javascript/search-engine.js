// --------------on start up------------------------
$("#advanced-search").hide();



//---------------functions-----------------
function randomKey() {
  const KenKey = "c969a48f9cee4515b05f7efc8cf78b6b";
  const VasaviKey = "4c88548ce7104df58f4630127aabfa78";
  const WayneKey = "bbb86315753e407180066c6762ddee79";
  const keyArray = [KenKey, WayneKey, VasaviKey];

  randomKeyIndex = Math.floor(Math.random() * keyArray.length);
  const randomKey = keyArray[randomKeyIndex];

  return randomKey;
}

function getParameters() {
  const searchParameters = {
    query: "",
    advancedSearch: "",
    cuisines: "",
    diets: "",
    intolerances: "",
    exclusions: ""
  };
  searchParameters.query = $("#search-query").val();
  searchParameters.advancedSearch = $('#advanced-search-button').attr("value");
  searchParameters.cuisines = $("#cuisine").val();
  searchParameters.diets = $("#diet").val();
  searchParameters.intolerances = $("#intolerences").val();
  searchParameters.exclusions = $("#exclude-ingredients").val();

  return searchParameters;
}

function constructEndpointQuery() {
  searchParameters = getParameters();
  const number = "&number=12";
  const instructionsRequired = "&instructionsRequired=true";
  const base = "https://api.spoonacular.com/recipes/search?"; //base endpoint
  const query = "query=" + searchParameters.query;
  const cuisines = "&cuisine=" + searchParameters.cuisines;
  const diet = "&diet=" + searchParameters.diets;
  const intolerances = "&intolerances=" + searchParameters.intolerances;
  const exclusions = "&exclusions=" + searchParameters.exclusions;
  const userKey = randomKey(); //api key
  const APIkey = "&apiKey=" + userKey; //
  let endpoint;
  if (searchParameters.advancedSearch==="true") {
    endpoint =
      base +
      query +
      number +
      instructionsRequired +
      cuisines +
      diet +
      intolerances +
      exclusions +
      APIkey;
  } else {
    endpoint = base + query + number + instructionsRequired + APIkey;
  }

  console.log(endpoint);
  return endpoint;
}

function ajaxRequest(URL,callback){
    $.ajax({
        url: URL,
        method: "GET"
      }).then(callback);//Display results file in another file
}

// ----------------------------- search functions --------------------------------------------
// Basic Search by query and 
function search(){

url = constructEndpointQuery();
ajaxRequest(url,displayResults);
}

//----------------------------------LISTENERS----------------------------------------------------
//-----------------------------------------------------------------------------------------------

$("#search-query").on("keypress", function(event) {
  if (event.which === 13) {
    event.preventDefault();
    $('#search-results').empty();
    search();
  }
});

$("#advanced-search").on("keypress", function(event) {
  if (event.which === 13 && $(event.target).is("input")) {
    $('#search-results').empty();
    event.preventDefault();
    search();
  }
});



// listners for all dynamic content, excutes functions depending on content
$(document).on('click',function(event){

  clickedItem = $(event.target);

  if (clickedItem.is('#close-icon, #close-window')||clickedItem.parent().is('#close-icon, #close-window')){ // close modals
      $('.modal-container').remove();
  }

  if (clickedItem.is('.fa-search')||clickedItem.parent().is('.fa-search')){ // Search by clicking magnifing glass
    $('#search-results').empty();
    $('.fa-search').toggleClass("spinner");
    search();
    setTimeout(() => {  $('.fa-search').toggleClass("spinner"); }, 500);
   
  }

  if (clickedItem.is('.result-card')||clickedItem.parent().is('.result-card')){ // popup recipe modal by clicking on cards
    expandRecipe(clickedItem);
  }

  // toggle saving of favourites anywhere in the page.
  if (clickedItem.is('.add-favourite-button')||clickedItem.parents().is('.add-favourite-button')||clickedItem.is('.remove-favourite-button')||clickedItem.parents().is('.remove-favourite-button')){
    
    if (clickedItem.is(".add-favourite-button")||clickedItem.parents().is('.add-favourite-button')){
      const buttonEl = document.getElementsByClassName("add-favourite-button");
      console.log(buttonEl);
      buttonEl[0].classList.add("remove-favourite-button");
      buttonEl[0].classList.remove("add-favourite-button");
      const favouriteText = document.getElementById("favourite-button-text");
      console.log(favouriteText);
      favouriteText.innerHTML = "Remove from favourites"
      addToFavourites();
    } else {
      const buttonEl = document.getElementsByClassName("remove-favourite-button");
      console.log(buttonEl);
      buttonEl[0].classList.add("add-favourite-button");
      buttonEl[0].classList.remove("remove-favourite-button");
      const favouriteText = document.getElementById("favourite-button-text");
      console.log(favouriteText);
      favouriteText.innerHTML = "Add to favourites"
      removeFromFavourites();
    }
  }
 //toggle adding ingredients to the cart.
  if (clickedItem.is('#add-to-cart')||clickedItem.is('#add-to-cart-text')||clickedItem.is('#add-to-cart-icon')||clickedItem.parent().is('#add-to-cart-icon')){
    if (clickedItem.is(".add-cart-button")||clickedItem.parents().is('.add-cart-button')){
      const buttonEl = document.getElementById("add-to-cart");
      console.log(buttonEl);
      buttonEl.classList.add("remove-cart-button");
      buttonEl.classList.remove("add-cart-button");
      const cartText = document.getElementById("add-to-cart-text");
      console.log(cartText);
      cartText.innerHTML = "Remove from shopping list"
      addToIngredientList();
    } else {
      const buttonEl = document.getElementById("add-to-cart");
      console.log(buttonEl);
      buttonEl.classList.add("add-cart-button");
      buttonEl.classList.remove("remove-cart-button");
      const cartText = document.getElementById("add-to-cart-text");
      console.log(cartText);
      cartText.innerHTML = "Add to shopping list"
      removeFromIngredientList();
    }
  }
  if (clickedItem.is('#cart-container')||clickedItem.is('#open-cart')||clickedItem.parent().is('#open-cart')){
    openShoppingCart();
  }
});

//expands search bar
$('#advanced-search-button').click(function(){
  $('#advanced-search').toggle("slow");

 
if ($('#advanced-search-button').attr("value")==="false"){
  $('#advanced-search-button').attr("value","true")
} else {
  $('#advanced-search-button').attr("value","false")
}

});
