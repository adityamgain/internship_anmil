let arr=[1,4,2,5,33,5,3,1,0,6];
let unique=[];
for(let i=0;i<arr.length;i++){
    if(!unique.includes(arr[i])){
        unique.push(arr[i]);
    }
}
console.log(unique);