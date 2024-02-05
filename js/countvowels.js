let vowels=["a","e","i","o","u"];
let str="sagarmatha";
let count=0;
for(let char of str.toLowerCase()){
    if(vowels.includes(char)){
        count++;
    }
}
console.log(count);