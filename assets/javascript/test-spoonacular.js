
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

