let arr=[10,30,15,40,20,5];
let first=arr[0];
let second=arr[0];
for(let i=0;i<arr.length;i++){
    if(arr[i]>first){
        second=first;
        first=arr[i];
    }
    else if(arr[i]>second){
        second=arr[i];
    }
}
console.log(second);