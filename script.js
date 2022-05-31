let operations = {
    '.': function(a, b){return parseFloat(`${a}.${b}`)},
    '/': function(a, b){return a/b},
    '×': function(a, b){return a*b},
    '+': function(a, b){return a+b},
    '-': function(a, b){return a-b}
};

let allValues = [];
let preliminaryValue = [];
document.querySelectorAll('.button').forEach((button) => {
    
    button.addEventListener("click", ()=>{
        const display = document.querySelector('.display');
        
        if(button.id !== '='){
            if(display.innerText === undefined){
                display.innerText = button.id;
            }else{
                display.innerText = display.innerText + button.id;
            }
            if(button.id !== '+' && button.id !== '-' && button.id !== '×' && button.id !== '/'){
                preliminaryValue.push(button.id);
            }else{
                if(preliminaryValue.length !== 0){
                    allValues.push(preliminaryValue.join(''));     
                    preliminaryValue = [];
                }
                allValues.push(button.id);
            }
        }else {
            allValues.push(preliminaryValue.join(''));
            preliminaryValue = []; 
        }
        console.log(allValues);
                
    })
})


 
 function parseNegatives(){
     let count = 0;
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
     
     if(Object.keys(split).length > 0){
        for(let i = 0; i<split['-'].length; i++){
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
        }
     }
    
 };

 function operate(){
    
    for(let j = 1; j<allValues.length; j = 1){
        allValues.splice(j-1, 3, operations[allValues[j]](parseFloat(allValues[j-1]), parseFloat(allValues[j+1])))
    }
    console.log(allValues);
 }

function manager(){
    parseNegatives();
    operate();
}
document.getElementById('=').addEventListener('click', manager);


