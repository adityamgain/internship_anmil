let word="the longest word in this sentence";
let arr= word.split(" ");
let longest=arr[0].length;
let position=0;
for(let i=1;i<arr.length;i++){
    if(longest<arr[i].length){
        longest=arr[i].length;
        position=i;
    }
}
console.log(arr[position]);