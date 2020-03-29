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
  searchParameters.advancedSearch = "placeholder";
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
  if (searchParameters.advancedSearch) {
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

function search(){
url = constructEndpointQuery();
ajaxRequest(url,displayResults);
}

//----------------------------------LISTENERS----------------------------------------------------
//-----------------------------------------------------------------------------------------------

$("#search-query").on("keypress", function(event) {
  if (event.which === 13) {
    event.preventDefault();
    search();
  }
});
// listners for all dynamic content, excutes fucntions depending on content
$(document).on('click',function(event){
  clickedItem = $(event.target);
  if (clickedItem.is('#close-icon, #close-window')||clickedItem.parent().is('#close-icon, #close-window')){
      $('.modal-container').remove();
  }
  if (clickedItem.is('.fa-search')||clickedItem.parent().is('.fa-search')){
    $('.fa-search').toggleClass("spinner");
    setTimeout(() => {  $('.fa-search').toggleClass("spinner"); }, 500);
    search();
    setTimeout(() => {  $('.fa-search').toggleClass("spinner"); }, 500);
   
  }
  if (clickedItem.is('.result-card')||clickedItem.parent().is('.result-card')){
    console.log("giving clicked item to displayFullRecipe");
    expandRecipe(clickedItem);
  }

});

//expands search bar
$('#advanced-search-button').click(function(){
  $('#advanced-search').toggle("slow");
});