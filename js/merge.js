let arr1=[1,3,6,9,10];
let arr2=[4,8,12,16,20];
let merged=[];
let a=0;
let b=0;
let curr=0;
while(curr<(arr1.length+arr2.length)){
    let unmerged1=arr1[a];
    let unmerged2=arr2[b];
    if(unmerged1<unmerged2){
        merged[curr]=unmerged1;
        a++;
    }else{
        merged[curr]=unmerged2;
        b++;
    }
    curr++;
}
console.log(merged);