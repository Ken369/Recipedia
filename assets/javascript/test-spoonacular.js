//---------------functions-----------------
function randomKey(){
    const KenKey = "c969a48f9cee4515b05f7efc8cf78b6b";
    const VasaviKey = "4c88548ce7104df58f4630127aabfa78";
    const WayneKey = "bbb86315753e407180066c6762ddee79";
    const keyArray = [KenKey,WayneKey,VasaviKey];
    const randomKey = keyArray[Math.floor(Math.random()*length.keyArray)];
    return randomKey;
}

function constructQuery(){
    const endpoint = "https://api.spoonacular.com/recipes/search?"
    const APIkey = randomKey();
    const query = "query="+$('#search-query').val()
    const url = endpoint+query+APIkey
    return url;
}

function ajaxRequest(URL){
    $.ajax({
        url: URL,
        method: "GET"
      }).then(displayResults);
  }



function displayResults(ajaxResponse){
    imgTag = $('<img>');
    pTag = $('<p>');
    console.log(ajaxResponse);
    pTag = ajaxResponse.results[0].title
    imgTag.attr('src',ajaxResponse.results[0].image);
    $('#results').append(pTag);
    $('#results').append(imgTag);

}

function search(){
    url = constructQuery;
    ajaxRequest(url);
}
//------------- event listener ----------------
$('#search-button').click(search);