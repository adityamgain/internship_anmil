let str1="Race";
let str2="Carrre";
str1=str1.toLowerCase();
str2=str2.toLowerCase();
if(str1.length==str2.length){
    str1 = str1.split('').sort().join('')
    str2 = str2.split('').sort().join('')
    if(str1==str2){
        console.log('true');
    }else{
        console.log('false');
    }
}else{
    console.log('false');
}