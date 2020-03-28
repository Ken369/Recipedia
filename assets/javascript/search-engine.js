// --------------on start up------------------------
$('#advanced-search').hide();

//---------------functions-----------------
function randomKey(){
    const KenKey = "c969a48f9cee4515b05f7efc8cf78b6b";
    const VasaviKey = "4c88548ce7104df58f4630127aabfa78";
    const WayneKey = "bbb86315753e407180066c6762ddee79";
    const keyArray = [KenKey,WayneKey,VasaviKey];

    randomKeyIndex = Math.floor(Math.random()*keyArray.length);
    const randomKey = keyArray[randomKeyIndex];

    return randomKey;
}

function getParameters(){
    const searchParameters = {
        query:"",
        advancedSearch:"",
        cuisines:"", 
        diets:"", 
        intolerances:"",
        exclusions:""
    };
    searchParameters.query = $('#search-query').val();
    searchParameters.advancedSearch = "placeholder"; 
    searchParameters.cuisines = $('#cuisine').val();
    searchParameters.diets = $('#diet').val();
    searchParameters.intolerances = $('#intolerences').val();
    searchParameters.exclusions = $('#exclude-ingredients').val();

    return searchParameters;
}

function constructEndpointQuery(){
    searchParameters = getParameters();
    const number = "&number=12"
    const instructionsRequired = "&instructionsRequired=true"
    const base = "https://api.spoonacular.com/recipes/search?"; //base endpoint 
    const query = "query="+searchParameters.query;
    const cuisines = "&cuisine="+searchParameters.cuisines;
    const diet = "&diet="+searchParameters.diets;
    const intolerances = "&intolerances="+searchParameters.intolerances;
    const exclusions = "&exclusions="+searchParameters.exclusions;
    const userKey = randomKey(); //api key     
    const APIkey = "&apiKey="+userKey; //
    let endpoint;
    if (searchParameters.advancedSearch){
        endpoint = base+query+number+instructionsRequired+cuisines+diet+intolerances+exclusions+APIkey;
    } else {
        endpoint = base+query+number+instructionsRequired+APIkey;
    }

    console.log(endpoint);
    return endpoint;
}

function ajaxRequest(URL){
    $.ajax({
        url: URL,
        method: "GET"
      }).then(displayResults);//Display results file in another file
    }
    function search(){
    url = constructEndpointQuery();
    ajaxRequest(url);
}

  
//----------------------------------LISTENERS----------------------------------------------------
//-----------------------------------------------------------------------------------------------
$('.fa-search').click(function(){
    search();
});

$('#search-query').on('keypress',function(event) {
    if(event.which === 13) {
        event.preventDefault();
        search();
    }
});

$('#advanced-search-button').click(function(){
    $("#advanced-search").toggle("slow");
});

$('#advanced-search').on('keypress', function(event){
    element = $(event.target);
    if (element.is('input') && event.which === 13){
        search();
    }
})

//Clicking recipe in a list
$("#search-results").on("click", ".list-recipes", function(event){
    console.log(event.currentTarget.getAttribute("data-id"));
    const recipeId = event.currentTarget.getAttribute("data-id");
    //const recipes = event.currentTarget.innerText;
    const userKey = randomKey(); //api key     
    const APIkey = "&apiKey="+userKey; 
    const IngURL = "https://api.spoonacular.com/recipes/" + recipeId + "/ingredientWidget.json";
  $.ajax({
      url: IngURL,
      method: "GET"
  }).then(function (response){

    console.log(response);
    var ingredients = $('<ul>');
    ingredients.text(response);
   $("#ingredients-card").append(ingredients);
  });
})

