
const operations = {
    '.': function(a, b){return parseFloat(`${a}.${b}`)},
    '/': function(a, b){return a/b},
    '×': function(a, b){return a*b},
    '+': function(a, b){return a+b},
    '-': function(a, b){return a-b}
};

let allValues = [];
let preliminaryValue = [];
const display = document.querySelector('.display');
const displayWrapper = document.querySelector('.displayWrapper');
let clumpedNegatives = 0;


document.querySelectorAll('.button').forEach((button) => {  
    button.addEventListener("mousedown", ()=> button.style.boxShadow  ="1px 2px 18px black")
    button.addEventListener("mouseup",  () =>   button.style.boxShadow = "0px 0px")
    if(button.id === 'C'){
        button.addEventListener('click', clear)
    }else if(button.id === 'bck'){
        button.addEventListener('click', backspace)
    }else{
        button.addEventListener("click", displayStore);
    }
})


function clear(){
    preliminaryValue = [];
    allValues = [];
    display.innerText = '';
    display.style.fontSize = '60px';
}

function backspace(){
    if(preliminaryValue.length > 0){
        preliminaryValue.splice(-1, 1);
    }else{
        if(allValues[allValues.length - 1].length > 1){
            
            preliminaryValue = allValues[allValues.length - 1].split('');
            preliminaryValue.splice(-1, 1);
            allValues.splice(-1, 1);
            allValues.push(preliminaryValue.join(''));

            preliminaryValue = [];
        }else{
            allValues.splice(-1, 1);
        }
        console.log(allValues)
    }
    if(preliminaryValue.length === 0 && allValues.length === 0){
        display.style.fontSize = '40px';
    }
    display.innerText = display.innerText.substr(0, (display.innerText.length - 1));
    
}

function displayStore(evt){
    avoidOverflow(display.clientWidth, displayWrapper.clientWidth);
    const btnId = evt.currentTarget.id;    
        if(btnId !== '='){
            if(display.innerText === undefined || display.innerText === 'SYNTAX ERROR'){
                display.innerText = btnId;
            }else{
                display.innerText = display.innerText + btnId;
            }
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
            allValues.push(preliminaryValue.join(''));
            preliminaryValue = []; 
            manager();
            preliminaryValue[0] = allValues[0];
            allValues.splice(0, 1);
            
    }
}

function avoidOverflow(widthDisplay, widthDisplayWrapper){
    console.log(widthDisplay);
    console.log(widthDisplayWrapper);

    if(widthDisplay > (widthDisplayWrapper-20)){
        let newFontSize = parseFloat(display.style.fontSize.substr(0, 2)) - 5;
        display.style.fontSize = `${newFontSize}px`
    }
}

function indexNegative(){
    let index = 0;
    const split = allValues.reduce((obj, value) => {
        if(value === '-'){
           if(!obj[value]){
               obj[value] = [];
           }
           obj[value].push(index);
        }
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
    let count = 0;
    const split = indexNegative();
    
     if(Object.keys(split).length > 0){
        for(let i = 0; i<split['-'].length; i++){
            if((split['-'][i]+1) === split['-'][i+1]){
                clumpedNegatives += 1;
                if(allValues[(split['-'][i] -1)] !== '-' && isNaN(allValues[(split['-'][i] -1)])){
                    clumpedNegatives += 1; 
                }
            }

            if(clumpedNegatives < 2){
                if(split['-'][i] == 0){
                    allValues.splice(0, 2, `-${allValues[i+1]}`);
                    count  += 1;
                }else if(allValues[split['-'][i]-count+1] == '-'){
                    allValues.splice(split['-'][i]-count, 2, '+');
                    count  += 1;
                }else if(!isNaN(parseFloat(allValues[split['-'][i]-count+1])) && isNaN(parseFloat(allValues[split['-'][i]-count-1]))){
                    allValues.splice(split['-'][i]-count, 2, `-${allValues[split['-'][i]-count+1]}`);
                    count += 1;
                }else if(!isNaN(parseFloat(allValues[split['-'][i]-count-1])) && isNaN(parseFloat(allValues[split['-'][i]-count+1]))){
                    allValues.splice(split['-'][i]-count, 1);
                    count += 1;
                    allValues.splice(split['-'][i]-count+2, 1, `-${allValues[split['-'][i]-count+2]}`);
                }
            }else{
                allValues = [];
                allValues[0] = NaN;
                clumpedNegatives = 0;
            }
            
        }
     }   
 }
 
function operate(){
    try{
        for(let j = 1; j<allValues.length; j = 1){
            allValues.splice(j-1, 3, operations[allValues[j]](parseFloat(allValues[j-1]), parseFloat(allValues[j+1])));
        }

        if(allValues[0] === Infinity || isNaN(allValues[0])){
            display.innerText = 'SYNTAX ERROR';
            allValues = [];
            preliminaryValue = [];
        }else{
            display.innerText = Math.round(allValues[0]*1000)/1000;
        }
    }
    catch(err){
        allValues = [];
        preliminaryValue = [];
        display.innerText = 'SYNTAX ERROR'
    }
 }
