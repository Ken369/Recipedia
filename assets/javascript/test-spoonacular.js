//--------------global Variables-------------------



//---------------placeholders-----------------------
    // supported cuisine types
    const cuisine = [
        "African",
        "American",
        "British",
        "Cajun",
        "Caribbean",
        "Chinese",
        "Eastern European",
        "European",
        "French",
        "German",
        "Greek",
        "Indian",
        "Irish",
        "Italian",
        "Japanese",
        "Jewish",
        "Korean",
        "Latin American",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Nordic",
        "Southern",
        "Spanish",
        "Thai",
        "Vietnamese"
    ]
    // list of supported intolerences 
    const intolerances = [
        "Dairy",
        "Egg",
        "Gluten",
        "Grain",
        "Peanut",
        "Seafood",
        "Sesame",
        "Shellfish",
        "Soy",
        "Sulfite",
        "Tree Nut",
        "Wheat",
    ]

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

function getQuery(){
    searchQuery = $('#search-query').val()
    return searchQuery;
}

function constructQuery(){
    const number = 10 // number of results to return
    const endpoint = "https://api.spoonacular.com/recipes/search?"; //base endpoint
    const userKey = randomKey(); //api key
    const APIkey = "&apiKey="+userKey; //
    const query = "query="+getQuery();
    const url = endpoint+query+APIkey
    console.log(url);
    return url;
}

function endpointConstructor(){

}

function ajaxRequest(URL){
    $.ajax({
        url: URL,
        method: "GET"
      }).then(displayResults);
  }



function displayResults(ajaxResponse){
    console.log(ajaxResponse);
    imgTag = $('<img>');
    pTag = $('<p>');
    pTag = ajaxResponse.results[0].title
    imgTag.attr('src',ajaxResponse.baseUri+ajaxResponse.results[0].image);
    $('#search-results').append(pTag);
    $('#search-results').append(imgTag);
}

function search(){
    url = constructQuery();
    ajaxRequest(url);
}
//------------- event listeners ----------------
$('.fa-search').click(function(){
    search();
});

$('#search-query').on('keypress',function(event) {
    if(event.which === 13) {
        event.preventDefault();
        search();
    }
});



mdc.ripple.MDCRipple.attachTo(document.querySelector('.foo-button'));