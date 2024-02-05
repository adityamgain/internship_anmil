let str="reverse the words from string";
let arr= str.split(" ");
let newSentence="";
for(let i=arr.length-1;i>=0;i--){
    newSentence+=arr[i]+" ";
}
console.log(newSentence);