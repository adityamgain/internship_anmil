const email = "amgainadityaa@gmail.com"; 
const emailPattern =  
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
const isValid = emailPattern.test(email); 
console.log(isValid);