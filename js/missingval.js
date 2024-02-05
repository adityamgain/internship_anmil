let arr=[1,4,2,3,6,7,5,9,10,0];
let higest=0;
for(let i=0;i<arr.length;i++){
    if(arr[i]>higest){
        higest=arr[i];
    }
}
for(let i=0;i<=higest;i++){
    if(!arr.includes(i)){
        console.log(i);
    }
}