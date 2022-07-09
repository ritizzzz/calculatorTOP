
const operations = {
    '.': function(a, b){return parseFloat(`${a}.${b}`)},
    '/': function(a, b){return a/b},
    '×': function(a, b){return a*b},
    '+': function(a, b){return a+b},
    '-': function(a, b){return a-b}
};

// initialation of variables
let allValues = [];
let preliminaryValue = [];
const display = document.querySelector('.display');
const displayWrapper = document.querySelector('.displayWrapper');
let clumpedNegatives = 0;

// added event listeners
document.querySelectorAll('.button').forEach((button) => {  
    //click effect
    button.addEventListener("mousedown", ()=> button.style.boxShadow  ="1px 2px 18px black")
    button.addEventListener("mouseup",  () =>   button.style.boxShadow = "0px 0px")

    //three actions stated with different buttons, clear backspace and display store with =
    if(button.id === 'C'){
        button.addEventListener('click', clear)
    }else if(button.id === 'bck'){
        button.addEventListener('click', backspace)
    }else{
        button.addEventListener("click", displayStore);
    }
})

//clear function
function clear(){
    clearArrays();
    display.innerText = '';
    display.style.fontSize = '40px';
}

//partial clear
function clearArrays(){
    preliminaryValue = [];
    allValues = [];
}

// backspace function
function backspace(){
    //if value present in preliminary, delete the end value
    if(allValues.length>0 || preliminaryValue.length>0){
        if(preliminaryValue.length > 0){
            preliminaryValue.splice(-1, 1);
        }else{
            // if the length of end value is greater than zero, 345
            if(allValues[allValues.length - 1].length > 1){
                // send it off too preliminary  3,4,5
                preliminaryValue = allValues[allValues.length - 1].split('');
                // splice it there 3,4
                preliminaryValue.splice(-1, 1);
                //splice it off the allValues, 345 -> ---
                allValues.splice(-1, 1);
                // push the spliced preliminary to all values after joining, 34
                allValues.push(preliminaryValue.join(''));
                // set preliminary to zero
                preliminaryValue = [];
            }else{
                // if the length is just one, 3, just get rid of it, -
                allValues.splice(-1, 1);
            }
        }
        // if everything has been deleted
        if(preliminaryValue.length === 0 && allValues.length === 0){
            display.style.fontSize = '40px';
        }

        // display it
        display.innerText = display.innerText.substr(0, (display.innerText.length - 1));
    }
}

function displayStore(evt){
    
    avoidOverflow(displayWrapper.clientWidth);
    
    const btnId = evt.currentTarget.id;    
    
        if(btnId !== '='){
            // if no numbers present
            if(display.innerText === undefined || display.innerText === 'SYNTAX ERROR' || display.innerText === 'MATH ERROR'){
                // set it to the number
                display.innerText = btnId;
            }else{
                // append previous numbers
                display.innerText = display.innerText + btnId;
            }
            // if operator perform logic as stated on readme.md
            if(btnId !== '+' && btnId !== '-' && btnId !== '×' && btnId !== '/'){
                preliminaryValue.push(btnId);
            }else{
                if(preliminaryValue.length !== 0){
                    allValues.push(preliminaryValue.join(''));     
                    preliminaryValue = [];
                }
                allValues.push(btnId);
            }
        }else {
            // to prevent error when user presses = without any values or after an error    
            if(allValues.length>0 || preliminaryValue.length>0){
                // logic as stated on readme.md
                if(preliminaryValue.length>0){
                    allValues.push(preliminaryValue.join(''));
                }
                preliminaryValue = []; 
                manager();
                display.style.fontSize = '40px';
                avoidOverflow(displayWrapper.clientWidth);
            }else{
                // set it to undefined
                display.innerText === undefined;
            }
    }
}

function prepareNextCalculation(){
    // send it to preliminary if the result has a length larger than 1
    console.log(allValues[0])
    if(allValues[0].toString().length>1){
        preliminaryValue = allValues[0].toString().split('');
     }else{
        preliminaryValue[0] = allValues[0];
     }
     allValues.splice(0, 1);
}

function avoidOverflow(widthDisplayWrapper){
    while(display.clientWidth >  (widthDisplayWrapper-20)){
        let newFontSize = parseFloat(display.style.fontSize.substr(0, 2)) - 1;
        display.style.fontSize = `${newFontSize}px`;
    }
}
// indexing of negative using reduce
function indexNegative(){
    let index = 0;
    // an empty object
    const split = allValues.reduce((obj, value) => {
        // for each value in array, if it is a negative sign
        if(value === '-'){
            // and if its object doesn't exist
           if(!obj[value]){
               // create it and make it a empty array
               obj[value] = [];
           }
           // push the index into the array
           obj[value].push(index);
        }
        // increment index and return object
        index+=1;
        return obj;
    }, {})
    return split;
}




function manager(){
    parseNegatives();
    operate();
}

function parseNegatives(){
    // count to account for spliced values
    let count = 0;
    const split = indexNegative();
    
    // if negatives exist
     if(Object.keys(split).length > 0){
         // detect clumped negatives
        for(let i = 0; i<split['-'].length; i++){
            // if the value in index of negative increment each other more than twice so 2,3,4 this indicates ---
            if((split['-'][i]+1) === split['-'][i+1]){
                clumpedNegatives += 1;
                if(allValues[(split['-'][i] -1)] !== '-' && isNaN(allValues[(split['-'][i] -1)])){
                    clumpedNegatives += 1; 
                }
            }
            // if it is less than 2
            if(clumpedNegatives < 2){
                // parse negative at front
                if(split['-'][i] == 0){
                    allValues.splice(0, 2, `-${allValues[i+1]}`);
                    count  += 1;
                // parse double negatives --
                }else if(allValues[split['-'][i]-count+1] == '-'){
                    allValues.splice(split['-'][i]-count, 2, '+');
                    count  += 1;
                // parse negative in format +-, /-
                }else if(!isNaN(parseFloat(allValues[split['-'][i]-count+1])) && isNaN(parseFloat(allValues[split['-'][i]-count-1]))){
                    allValues.splice(split['-'][i]-count, 2, `-${allValues[split['-'][i]-count+1]}`);
                    count += 1;
                // parse negative in format -+,  -/ ...
                }else if(!isNaN(parseFloat(allValues[split['-'][i]-count-1])) && isNaN(parseFloat(allValues[split['-'][i]-count+1]))){
                    allValues.splice(split['-'][i]-count, 1);
                    count += 1;
                    allValues.splice(split['-'][i]-count+2, 1, `-${allValues[split['-'][i]-count+2]}`);
                }
                clumpedNegatives = 0;
            }else{
                // if there are clumped negatives, set all values up for a error to split out
                allValues = [];
                allValues[0] = NaN;
            }
            
        }
     }   
 }


 
function operate(){
    try{
        // usage of operation object to do the calculation
        for(let j = 1; j<allValues.length; j = 1){
            allValues.splice(j-1, 3, operations[allValues[j]](parseFloat(allValues[j-1]), parseFloat(allValues[j+1])));
        }
        // if it spits out NAN it is syntax error
        if(isNaN(allValues[0])){
            display.innerText = 'SYNTAX ERROR';
            clearArrays();
        // if infinity is split out, then it is math error since user has tried to divide by 0
        }else if(allValues[0] === Infinity){
            display.innerText = 'MATH ERROR';
            clearArrays();
        }else{
            // set display, the calculation has been done successfully
            display.innerText = Math.round(allValues[0]*1000)/1000;
            prepareNextCalculation();   
        }
    }
    catch(err){
        // an error has occured in the forloop due to the syntax of the input
        clearArrays();
        display.innerText = 'SYNTAX ERROR'
    }
}
