function displayResults(ajaxResponse) {
  var recipeArray = ajaxResponse.results;
  console.log(ajaxResponse);
  for (var i = 0; i < recipeArray.length; i++) {
    //var recipeId = recipeArray[i].id;
    var list = $("<ul>");
    var listRecipesTitle = $('<a href="#">');
    listRecipesTitle.text(recipeArray[i].title);
    listRecipesTitle.addClass("list-recipes");
    listRecipesTitle.attr("data-id", recipeArray[i].id);
    var listRecipesProcessing = $("<p>");
    listRecipesProcessing.text(
      "Processing Time: " + recipeArray[i].readyInMinutes
    );
    var listRecipesServing = $("<p>");
    listRecipesServing.text("Total Servings: " + recipeArray[i].servings);

    var img = $("<img>");
    img.attr("src", ajaxResponse.baseUri + recipeArray[i].image);
    img.addClass("Image-size");

    $("#search-results").append(list);

    list.append(listRecipesTitle);
    list.append(listRecipesProcessing);
    list.append(listRecipesServing);
    list.append(img);
  }
}
