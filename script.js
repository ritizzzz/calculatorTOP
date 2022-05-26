

document.querySelectorAll('.button').forEach((button) => {
    
    button.addEventListener("click", ()=>{
        const display = document.querySelector('.display');
        if(display.innerText === undefined){
            display.innerText = button.id;
        }else{
            display.innerText = display.innerText + button.id;
        }
    })
})