function isBalanced(str) {
    let balance = 0;
  
    for (let char of str) {
      if (char === '{' || char === '[' || char === '(') {
        balance++;
      } else if (char === '}' || char === ']' || char === ')') {
        balance--;
        if (balance < 0) {
          return false;
        }
      }
    }
    return balance === 0;
}
console.log(isBalanced("{[()]}")); 
console.log(isBalanced("[(){}]")); 

  