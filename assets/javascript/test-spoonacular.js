
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


function getQuery(){
    searchQuery = $('#search-query').val();
   

    return searchQuery;
}

function constructEndpointQuery(){
    const excludeFoods = "placeholder" //
    const number = 10 // number of results to return
    const endpoint = "https://api.spoonacular.com/recipes/search?"; //base endpoint
    const userKey = randomKey(); //api key     
    const APIkey = "&apiKey="+userKey; //
    const query = "query="+getQuery();
    const url = endpoint+query+APIkey
    console.log(url);
    return url;
}

function endpointConstructor() {}

function ajaxRequest(URL) {
  $.ajax({
    url: URL,
    method: "GET"
  }).then(displayResults);
}

function displayResults(ajaxResponse) {
  var recipeArray = ajaxResponse.results;
  console.log(ajaxResponse.results);
  for (var i = 0; i < recipeArray.length; i++) {
    
    var list = $('<ul>');
    var listRecipesTitle = $('<a href="#">');

    listRecipesTitle.text(recipeArray[i].title );
    listRecipesTitle.addClass("list-recipes");
    var listRecipesProcessing = $('<p>');
    listRecipesProcessing.text("Processing Time: " + recipeArray[i].readyInMinutes);
    var listRecipesServing = $('<p>');
    listRecipesServing.text("Total Servings: " + recipeArray[i].servings);

    var img = $('<img>');
    img.attr('src', ajaxResponse.baseUri+ajaxResponse.results[i].image)
    
    $("#search-results").append(list);

    list.append(listRecipesTitle);
    list.append(listRecipesProcessing);
    list.append(listRecipesServing);
    list.append(img);


  }
  $("#search-results").on("click", ".list-recipes", function(){
    var div =  $("<div class='recipe-info'>");
    var processingTime = recipeArray[0].readyInMinutes;
    var pOne = $("<p>").text("Processing Time: " + processingTime);
    div.append(pOne);
     var servings = recipeArray[0].servings;
     var pTwo = $("<p>").text("servings: " + servings);
     div.append(pTwo);
})
}


function search(){
    getQuery;
    url = constructEndpointQuery();
    ajaxRequest(url);
}
//------------- event listeners ----------------
$(".fa-search").click(function() {
  search();
});

$("#search-query").on("keypress", function(event) {
  if (event.which === 13) {
    event.preventDefault();
    search();
  }
});

