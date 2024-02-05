let str="racefrdecar";
let j=str.length-1;
let bool=true;
for(let i=0;i<str.length/2;i++){
    if(str[i]!=str[j]){
        bool=false;
    }
    j--;
}
console.log(bool);