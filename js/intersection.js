let arr1=[1,2,3,4,5,6,7];
let arr2=[2,3,4,9,66,23];
let newarr=[];
for(let i=0;i<arr2.length;i++){
    if(arr1.includes(arr2[i])){
        newarr.push(arr2[i]);
    }
}
console.log(newarr);

