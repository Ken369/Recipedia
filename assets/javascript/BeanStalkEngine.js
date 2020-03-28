// Here's how to construct a sprout.
// assign your sprout a name.
    // e.g const newSprout = sprout(...) or const Modal = sprout(....);
// the main powerhouse of the sprout is the ability to store a complex HTML strucutre as an emmet string
    // using our modal example above -> const Modal = sprout("div>div>(h4+p+a)");
    // this will generate a sprout called Modale of the form
    /* 
    <div>
        <div>
            <h4>
            </h4>
            <p>
            </p>
            <a>
            </a>
        </div>
    <div> 
    */
// selectors, this allows you to assign classes, attributes and content via html selectors as your sprout is watered
    // this is the most general way to add styling to your sprout
    // you see the structure of the selectors and their values with sprout.selector
        // e.g  -> modal.selector, will return
        /* {
            div:{class:null,text:null,attributes{}},
            h4:{class:null,text:null,attributes{}},
            p:{class:null,text:null,attributes{}}, 
            a:{class:null,text:null,attributes{}}
            }
        */
        // you can set the sprout's selectors with an object that has all the information you want to convey.
            // sprout.selector = selectors; selectors = {h4:{class:"title",text:"this is a title"},p:{class:"content",text:"content to add"}};
        // You can be more selective. adding content via the addContent method.
            // this method is more general but isn't fully supported yet.
            // sprout.addContent(content), 
            /* with content = 
                {title:"this is a title",
                content:"some content to add",
                link:{href:"https://google.com",text:"link to google"}
            } 
            */
            // this adds titles to <h> tags, content to <p> tags and updates <a> href and innerhtml to relfect the link. 
            // it can also add image:{src:"imgSRC",alt:"imgAlt"}; and more support for this feature is being worked on.
        // 

// seeds, seeds are id's, they allow you to be more selective when you build your sprout. 
    // seeds are used to target a specific element in your emmet abreviation. 
    // just like a css property, use a # in front of the seed title directly after delcaring the html
        // -> div#modalSeed>div#modalBodySeed(h4+p+a)
        // will add seeds to both divs, you can now target these div's individually using these seeds.
        // the h4,p,a don't need seeds as you can simply target these with the selectors as they're not duplicate elements
    // you can then define a heap of properties for the seed as an Object.
    // you can -> Modal.seed = modalSeed:{class:"your class here", attributes{attr1:"value",attr2:"value"}}
    // the simplest way is to predefine an object call 'seed', that has everything defined and then set.
        // modal.seed = seed; for seed = {modalSeed:{class:"yourClass AnotherClass"}, modalBodySeed:{class:"bodyClass",text:"text to add"}}

// What is watering?
    // watering actually builds your card into existance. The nomenculture is just our silly way of keeping with the theme.
    // so you have a sprout call Modal. to activate it -> Modal.water(appendTo).
    // the appendTo target creates your modal and then appends it to the target you want.
        // so Modal.water("body"), Modal.water("#modal"), Modal.water("nav") appends the modal to the body, an id=modal, all nav elements.
    // watering should be the last step. You can't change the content or appearance of a sprout once it's watered.
        // This is because it's already in the DOM, and now you need to find these elements with traditional JavaScript/JQuery.

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------SPROUT CONSTRUCTOR AND METHODS------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

class Sprout {
    constructor (emmetString){
        this.emmetString = emmetString;
        this.selectors = extractSelectors(emmetString);
        this.seeds = null;
    }
    get selector(){
        return this.selectors;
    }
    get seed(){
        return this.seeds;
    }
    set selector (selectorObject) {
        this.selectors = selectorObject;
    }
    set seed (seedObject){
        this.seeds = seedObject;
    }
    addContent(content){
        if (typeof(content) === "object"){
            if (Array.isArray(content)){
                extractFromArray(content,this);
            } else {
                extractFromObject(content,this);
            }
        } else if (typeof(content) ==="string") {
            extractFromString(content,this);
        }
    }
    addClasses(classes){
        if (typeof(classes) === "object"){
            if (Array.isArray(classes)){
                classesFromArray(classes,this);
            } else {
                classesFromObject(classes,this);
            }
        } else if (typeof(classes) ==="string") {
            classesFromString(classes,this);
        }
    }
    water(appendTo){
        const emmetString = this.emmetString;
        const codeHierarchy = expandBrackets(emmetString);
        const results = collapseIntoCode(codeHierarchy,this);
        results.forEach(element => {
            $(appendTo).append(element);
        });
        germinateSeeds(this);
    }
    
}

// Shorthand for creating a sprout.
function sprout(emmetString) {
    const createdSprout = new Sprout(emmetString);
    return createdSprout;
}

//Extracts selectors from the emmetString and populates the selectors box.
function extractSelectors(emmetString){
    //while loop to remove all seed text by targeting the text between # and [>,(,+], which ever comes first
    let startSeed = 0;
    while (startSeed >=0) {
        startSeed = emmetString.indexOf("#",startSeed+1);
        const operators = ["\)","+",">"];
        const possibleMatches = [];
        operators.forEach(element => {
            const match = emmetString.indexOf(element,startSeed);
            if (match === -1){
                match = null;
            }
            possibleMatches.push(match);
        });
        const endSeed = Math.min(...possibleMatches);
        const thingtoReplace = emmetString.slice(startSeed,endSeed)
        emmetString = emmetString.replace(thingtoReplace,"+")
    }
    //now that all the unused text is gone, we're going to replace all [),(,>,] with the same operator "+"
    emmetString = emmetString.replace(/\)|>|\(/g,"+");
    //the only thing not text now is the "+" operator, so split it by that.
    //we now have our individual elements, but some unwated empty spaces, so filter them out.
    rawSelectors = emmetString.split('+').filter(function(value){
        if (value !== ""){
            return value;
        }
    });
    // we now have our raw selectors, but there might be some duplicates, so let's get rid of those.
    selectors = [];
    rawSelectors.forEach(element => {
        if (selectors.indexOf(element) === -1){
            selectors.push(element);
        }
    });
    // great! our individual selectors, However these need to be an object for us to store values under them.
    // Let's go ahead and turn this into an object.
    // first let's define the generic object each of the selector keys will take. 
        // these will ultimately need to get filled out, so let's leave them null as placeholders.
    const selectorProperties = {
        text:null,
        class:null,
        attributes:{}
    }
    //define an empty selector Object to populate.
    selectorObject ={};
    selectors.forEach(selector => {
        selectorObject[selector] = selectorProperties;
    });
    //Done! now we can pull this from the sprout anytime by using sprout.selector to see the content and the structure
    return selectorObject; 
}

function classesFromArray(){
    throw "currently not supported";
};

function classesFromObject(classes,sprout){
    for (const userKey in classes){
        console.log(userKey);
        for (const sproutKey in sprout){
            console.log(sproutKey);
            for (const sproutSubKey in sprout[sproutKey] ){
                console.log(sproutSubKey);
                if (userKey === sproutSubKey){
                    console.log('YEP!');
                    console.log(sprout[sproutKey][sproutSubKey]);
                    sprout[sproutKey][sproutSubKey].class = classes[userKey];
                }
            }
        }
    }
}

function classesFromString(){
    throw "currently not supported"
};

function extractFromObject(content,sprout){
    for (const key in content){
        if (key === "title" ){
            const titleSelectors = ["h1","h2","h3","h4","h5","h6"]
            for (const seed in sprout.seeds){
                if (seed === "titleSeed"){
                    sprout.seeds[seed]["text"] = content[key];
                }
            }
            for (const selector in sprout.selectors){
                titleSelectors.forEach(hTag => {
                    if (selector === hTag){
                        sprout.selectors[selector]["text"] = content[key];
                    }
                });
            }
        }
        if (key === "content" ){
            const contentSelectors = ["p"]
            for (const seed in sprout.seeds){
                if (seed === "contentSeed"){
                    sprout.seeds[seed]["text"] = content[key];
                } else {
                    for (const selector in sprout.selectors){
                        contentSelectors.forEach(pTag => {
                            if (selector === pTag){
                                sprout.selectors[selector]["text"] = content[key];
                            }
                        });
                    }
                }
            }
        }
        if (key === "link" ){
            const matchedSelectors = ["a"]
            for (const seed in sprout.seeds){
                if (seed === "linkSeed"){
                    sprout.seeds[seed]["text"] = content[key].content
                    sprout.seeds[seed]["attributes"]["href"]=content[key].href
                } else {
                    for (const selector in sprout.selectors){
                        matchedSelectors.forEach(matchedSelector => {
                            if (selector === matchedSelector){
                                sprout.selectors[selector]["text"] = content[key].text
                                sprout.selectors[selector]["attributes"]["href"]=content[key].href
                            }
                        });
                    }
                }
            }
        }
        if (key === "image" ){
            const matchedSelectors = ["img"]
            for (const seed in sprout.seeds){
                if (seed === "imgSeed"){
                    sprout.seeds[seed]["attributes"]["alt"] = content[key].alt
                    sprout.seeds[seed]["attributes"]["src"]=content[key].src
                } else {
                    for (const selector in sprout.selectors){
                        matchedSelectors.forEach(matchedSelector => {
                            if (selector === matchedSelector){
                                sprout.selectors[selector]["attributes"]["alt"] = content[key].alt
                                sprout.selectors[selector]["attributes"]["src"]=content[key].src
                            }
                        });
                    }
                }
            }
        }
        if (key === "list" ){
            const matchedSelectors = ["a"]
            for (const seed in sprout.seeds){
                if (seed === "contentSeed"){
                    sprout.seeds[seed]["text"] = content[key];
                } else {
                    for (const selector in sprout.selectors){
                        matchedSelectors.forEach(matchedSelector => {
                            if (sprout.selectors[selector] === matchedSelector){
                                sprout.selectors[selector].text = content[key];
                            }
                        });
                    }
                }
            }
        }
    };
}



function extractFromString(){
    throw "setting from a string not supported"
};


function extractFromArray(){
    throw "setting from an Array no supported"
};
//---------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------END SPROUT CONSTRUCTOR AND METHODS------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------






//----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------ENGINE-----------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------

// the engine that handles the brackets! it takes in an emmetString, and constructs a nested object that reflects the codeHierarchy.
function expandBrackets(emmetString){
    const rawString = emmetString;
    if (rawString.indexOf("\(") ===-1){
        return rawString;
    }
    function FINDdividers(rawString){
        function FINDplusOperators(rawString){
            const plusIndexArray = [];
            plusIndex = 0;
            while (plusIndex >= 0){
                plusIndex = rawString.indexOf("+",plusIndex+1);
                if (plusIndex !== -1){
                    plusIndexArray.push(plusIndex);
                }
            }
            return plusIndexArray;
        }
        plusIndexArray = FINDplusOperators(rawString);

        function FINDsiblingOperators(rawString,plusIndexArray){
            const siblingOperatorArray = [];
            plusIndexArray.forEach(plusIndex => {
                const openingBracketRight = rawString.indexOf("\(",plusIndex);
                const closingBracketRight = rawString.indexOf("\)",plusIndex);
                const openingBracketLeft = rawString.lastIndexOf("\(",plusIndex);
                const closingBracketLeft = rawString.lastIndexOf("\)",plusIndex);
                if (openingBracketRight <= closingBracketRight && closingBracketLeft >= openingBracketLeft){
                    siblingOperatorArray.push(plusIndex);
                }
            });
            return siblingOperatorArray;
        }
        siblingOperators = FINDsiblingOperators(rawString, plusIndexArray);

        function FINDcurrentScopeSiblingOperators(rawString,siblingOperators){
            const currentScopeSiblingOperators = [];
            siblingOperators.forEach(siblingOperator => {
                const stringLeft = rawString.slice(0,siblingOperator);
                const stringRight = rawString.slice(siblingOperator);
                function countBrackets(string){
                    const openingBrackets =  (string.match(/\(/g)||[]).length;
                    const closingBrackets = (string.match(/\)/g)||[]).length;
                    const count = openingBrackets+closingBrackets; 
                    currentScope = false;
                    if (openingBrackets === closingBrackets && count % 2 === 0 ){
                        currentScope = true;
                    }
                    return currentScope;
                }
              scopeCheckLeft = countBrackets(stringLeft);
              scopeCheckRight = countBrackets(stringRight);

              if (scopeCheckLeft === scopeCheckRight && scopeCheckLeft===true){
                  currentScopeSiblingOperators.push(siblingOperator)
              }
            });
            return currentScopeSiblingOperators;
        }
        currentScopeSiblingOperators = FINDcurrentScopeSiblingOperators(rawString,siblingOperators);

        return currentScopeSiblingOperators;
    }

    function conquer(rawString){
        if (rawString===""){
            return null;
        }
        const dividers = FINDdividers(rawString);
        const codeHierarchy = {}; 
        if (dividers.length === 0){
            start = rawString.indexOf("\(");
            if (start === -1){
                codeHierarchy["parent"] = rawString;
                codeHierarchy["child"] = null;
            } else {
                codeHierarchy["parent"] = rawString.slice(0,start-1);
                child = rawString.slice(start+1,rawString.length-1);
                codeHierarchy["child"] = conquer(child);
            }
            return codeHierarchy;
        } else {
            String.prototype.replaceAt=function(index, replacement) { //define replace at function 
                return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
            }
            dividers.forEach(divider => {
                rawString = rawString.replaceAt(divider,"~");
            });
            dividedString = rawString.split('~');
            let count = 0;
            dividedString.forEach(element => {
                parentLabel = "parent"+count;
                codeHierarchy[parentLabel] = conquer(element);
                count++;
            });
            return codeHierarchy;
        }
        
    }
    codeHierarchy = conquer(rawString);
    return codeHierarchy;
}
// collapses the hierarchy found by expand brackets, each emmetString after this can then be sent individually to be turned into JQOBs
function collapseIntoCode(codeHierarchy,sprout){
    const siblingArray = [];
    for (const key in codeHierarchy) {
        if (key.indexOf("parent")>=0 && typeof(codeHierarchy[key]) === "string") {

            let parentArray = findEmmetElements(codeHierarchy[key]);
            const parentJQOBArray = [];
            
            parentArray.forEach(emmetHierarchy => {
                 const parentJQOB = activateElement(emmetHierarchy,sprout);
                 parentJQOBArray.push(parentJQOB);
            });
            if (typeof(codeHierarchy.child)==="string"){
                const child = findEmmetElements(codeHierarchy.child)
                child.forEach(emmetHierarchy => {
                   const germinatedElement = activateElement(emmetHierarchy,sprout);
                   parent.append(germinatedElement)
                });
            } else {
                if (codeHierarchy.child === null){
                    const child = parentJQOBArray;
                    return child;

                } else {
                    const child = collapseIntoCode(codeHierarchy.child,sprout);
                    if (parentJQOBArray.length === 1){

                        child.forEach(element => {
                            parentJQOBArray[0].append(element);
                        });
                    }
                }
            }
            parentJQOBArray.forEach(element => {
                siblingArray.push(element)
            });
            
        } else if (key.indexOf("parent")>=0 && typeof(codeHierarchy[key])==="object") {
            const parentArray = collapseIntoCode(codeHierarchy[key],sprout);
            parentArray.forEach(element => {
                siblingArray.push(element);
            });
        }
    }
    return siblingArray
}

//takes the emmetStrings, finds the siblings then children and returns a nested object resembling the code structure
function findEmmetElements(emmetString){
    //finds all the siblings of the emmetString, i.e anything joined by a '+'
    const emmetElements = findSiblings(emmetString); //outputs is an array of elements, ALWAYS
    
    //finds if each element now has a child, i.e anything joined by a '>'
    emmetElements.forEach(emmetElement => {
        thisIndex = emmetElements.indexOf(emmetElement);

        emmetElements[thisIndex] = findChildren(emmetElement);
    }); //outputs and an array of objects, an array of elementHierarchys

    return emmetElements;
}

        // takes in an emmetElement as a string, finds the children of each string to each element and constructs a nested hierarchy
        function findChildren(emmetElement){

            let elementHierarchy ={};
            // if there is no '>' charatcer in the input, no children have been defined by the user.
            if (emmetElement.indexOf('>')===-1){
                elementHierarchy = {
                    parentElement:null,
                    childElement:null
                };
                //if no children, pass the input as the parent and keep children as 'null'
                elementHierarchy.parentElement = emmetElement;
            } else {
                // else, nesting has been defined by '>' character.
                
            elementHierarchy = findElementHierarchy(emmetElement);
            }
            
            return elementHierarchy;
            //we need to identify the child and the parent.

        }
        // takes in an emmetstring, splits them up by the "+" operator to seperate DOM sibling elements, returns an array of emmetstrings
        function findSiblings(emmetString){
            const emmetElements =[];
            if (emmetString.indexOf('+')===-1){
                emmetElements.push(emmetString)
            } else {
                siblingElements = emmetString.split('+');
                siblingElements.forEach(sibling => {
                    emmetElements.push(sibling);
                });
            }
            return emmetElements;
        }

        //finds nested elements that don't need brackets, e.g -> div>div>p.
         // more complicated strucutres that need brackets to add strucutre like -> div>div(h3+p) will be handled by a seperate engine
        function findElementHierarchy(string){
            const object = {
                parentElement:null,
                childElement:null
            };
            const index = string.indexOf('>');
            const parent = string.slice(0,index);
            const child = string.slice(index+1);
            object.parentElement = parent;
            object.childElement = child;

            if (child.indexOf('>') === -1){
                return object;
            } else {
                object.childElement = findElementHierarchy(child);
                return object
            }
        }


// once the emmetHierarchy has been found from emmet strings, this function turns them into JQOB's adding all relevent classes and content.
function activateElement(emmetHierarchy,sprout){
    //emmetHierarchy is an object with two keys parentElement and childElement
    const dynamicHierarchy = seedIdentification(emmetHierarchy);

    const dynamicTag = createTag(dynamicHierarchy,sprout);

    const specificJQOB = createJQOB(dynamicTag);

    return specificJQOB;
}
        //checks to see if an identified element has a seed and pairs it with the element in an object.
        function seedIdentification(emmetHierarchy){
            // need to go through both parent and child elements of the emmetHierarchy Object
                // emmetHierarchy.parentElement will always be populated
                // emmetHierarchy.childElement could be null, so check for that
            for (const properties in emmetHierarchy){
                // checks to see if it's null before executing code block
                if (emmetHierarchy[properties] !== null){
                    if (typeof(emmetHierarchy[properties])==="string"){
                        //create an object to seperate the emmetHierarchy parents and childs into a paired string element and seed ID.
                        const dynamicElement = {
                            stringElement:null,
                            seed:null,
                        };
                        const emmetElement = emmetHierarchy[properties];
                        // if emmetElement has a seed, seperate it, and store them together to identify later
                        if (emmetElement.indexOf('#') !== -1){
                            const seedStart = emmetElement.indexOf('#');
                            dynamicElement.seed = emmetElement.slice(seedStart+1);
                            dynamicElement.stringElement = emmetElement.slice(0,seedStart);

                        } else {
                            //otherwise just store the whole string, making sure to assign the seed null.
                            dynamicElement.stringElement = emmetElement
                        }
                        // assigns dynamic object back to the emmetHierarchy
                        emmetHierarchy[properties] = dynamicElement;
                    } else {
                        console.log(emmetHeirarchy);
                        emmetHierarchy[properties] = seedIdentification(emmetHierarchy[properties]);
                        return emmetHierarchy;
                    }
                } 
            } 
            // returns the updated emmetHierarchy object back to the caller
            return emmetHierarchy;
        }

        // takes in an object called dynamicHierarchy, which has the element as a string and a seed (if applicable).
        // as a required second argument, takes in the sprout you're watering. this add's selector traits.
        function createTag(dynamicHierarchy,sprout){
            
            for (const elements in dynamicHierarchy){
                if (dynamicHierarchy[elements] !== null){
                    //get the html element as a string
                    const element = dynamicHierarchy[elements].stringElement
                    if (typeof(element) === "string"){
                            // convert it to a tag and re-assign it.
                        dynamicHierarchy[elements].stringElement = "<"+element+">";
                        
                        //goes through the sprout object to check if you have assigned anything to this HTML tag
                            // if so, add the classes/content/attributes associated with it to the dynamicHierarchy object under the key: 'selectors'
                        dynamicHierarchy[elements]["selectors"] =  null;
                        for (const properties in sprout.selectors){
                            if (properties === element){
                                let selectors = sprout.selectors[properties];
                                dynamicHierarchy[elements]["selectors"] = selectors;
                            }
                        }
                    } else {
                        dynamicHierarchy[elements] = createTag(dynamicHierarchy[elements],sprout);
                        return dynamicHierarchy;

                    } 
                }
            }
            return dynamicHierarchy; 
        }
        //Takes in dynamicTag objects and converts them to a JQuery Object (JQOB), collapses all nested objects into a sinlge JQOB.
            // adds all necessary classes, titles, and seed elements as the dynamicTag object runs.
        function createJQOB(dynamicTag){
            
            const hierarchyArray = [];
        
            //Go through the object keys, if the key is an element with seed and class, create JQOB, and assign them to it.
            //otherwise it'll be an nested element in the heirarchy. So tell the function to call itself down a level.
            function collapseHierarchy(dynamicTag){
                for (properties in dynamicTag){
                
                    if (dynamicTag[properties]!==null){
            
                        if (typeof(dynamicTag[properties].stringElement) === "string"){
                            const JQOB = $(dynamicTag[properties].stringElement);
                            JQOB.attr("id", dynamicTag[properties].seed);

                            for (const selectors in dynamicTag[properties].selectors){
                                unpack(selectors,dynamicTag[properties].selectors,JQOB)
                            }
                            hierarchyArray.push(JQOB);
                        } else {
                            collapseHierarchy(dynamicTag[properties]);
                        }
                    } 
                }
            }
            collapseHierarchy(dynamicTag);

            // now go through each element in the flattened array and append them right to left.
        for (let i = hierarchyArray.length; i > 0; i--) {
            hierarchyArray[i-1].append(hierarchyArray[i]);
        }
            //return the parent as a nested html element with selector classes and id
            JQOB = hierarchyArray[0];
        
            return JQOB;
        }
// any properties in the seed object will now be applid in turn.
function germinateSeeds(sprout){
    for (const properties in sprout.seeds){
        id = unpack(properties,sprout.seeds,"seeds");
        $(id).removeAttr("id");
    }
}
        // unpacks seeds and class elements from thier objects and applies them to the DOM. (is the engine for the germinateSeed function)
        function unpack(properties,object,targetElement){
                // for selectors
                let id = "#"+properties;
                let Keys = Object.keys(object);
                objectToPullFrom = object

                // if seeding, change variables to suit seeding conditions
                if (targetElement === "seeds"){
                    targetElement = $(id);
                    Keys = Object.keys(object[properties]);
                    objectToPullFrom = object[properties];
                }
                // content adding system
                Keys.forEach(element => {
                if (element === "text"){
                    const content = objectToPullFrom[element];
                    targetElement.text(content);
                }
                if (element === "class"){
                    const classes = objectToPullFrom[element];
                    targetElement.addClass(classes);
                }
                if (element === "attributes"){
                    const attributeObject = objectToPullFrom[element];
                    for (const attributes in attributeObject)
                    targetElement.attr(attributes , attributeObject[attributes]);
                }
            });
            // returns id, only used in the germinateSeeds functions to clear the ID afterwards
            return id;
        }

//----------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------END ENGINE-----------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
