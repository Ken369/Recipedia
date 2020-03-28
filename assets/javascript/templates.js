const card  = sprout("div>div>(div>img+div>(span>(h2+p)))");
console.log(card.info);
why = {
    div:{text:null},
    img:{text:null, attributes:{}},
    span:{text:null},
    h2:{text:null},
    p:{text:null},
}

content = {
    title:"This is a title",
    content:"this is some content",
    image:{src:"https://via.placeholder.com/150", alt:"placeholder image"}
};
card.selector = extractSelectors("div>div>(div>img+div>(span>(h2+p)))");
// card.selectors = why
card.addContent(content);
card.water('#search-results');