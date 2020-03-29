function displayResults(ajaxResponse) {

  var recipeArray = ajaxResponse.results;
  console.log(ajaxResponse);

  for (var i = 0; i < recipeArray.length; i++) {
    //var recipeId = recipeArray[i].id;
    const info = {
      image:ajaxResponse.baseUri + recipeArray[i].image,
      title:recipeArray[i].title,
      id:recipeArray[i].id,
      totalTime:recipeArray[i].readyInMinutes,
    }
    const card = resultCard(info)
    $("#search-results").append(card);
  }
}

function resultCard (info) {
  card = $('<div>').addClass("result-card");
  img = $('<img>').addClass("image-card");
  totalTime = $('<p>').addClass("time-card");
  banner = $('<h6>').addClass("banner");
      // fill out information;
      img.attr("src",info.image);
      totalTime.text("Ready in: "+info.totalTime+"mins");
      banner.text(info.title);
      banner.attr("id",info.id);
      //append all to card
  card.append(banner,img,totalTime);
  
  return card;
  
}


// var list = $("<ul>");
// var listRecipesTitle = $('<a href="#">');
// listRecipesTitle.text(recipeArray[i].title);
// listRecipesTitle.addClass("list-recipes");
// listRecipesTitle.attr("data-id", recipeArray[i].id);
// var listRecipesProcessing = $("<p>");
// listRecipesProcessing.text(
//   "Processing Time: " + recipeArray[i].readyInMinutes
// );
// var listRecipesServing = $("<p>");
// listRecipesServing.text("Total Servings: " + recipeArray[i].servings);

// var img = $("<img>");
// img.attr("src", ajaxResponse.baseUri + recipeArray[i].image);
// img.addClass("Image-size");


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