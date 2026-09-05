function compressString(str){
    const myMap = new Map();
    for(let ch of str){
        if(myMap.has(ch)){
            myMap.set(ch, myMap.get(ch) + 1);
        }else{
            myMap.set(ch, 1);
        }
    }
    let result = "";
    for(let[key, value] of myMap.entries()){
        result += key+value;
    }
    console.log("Compressed String is: " + result);
}

const input = "sanstpspabzt";
compressString(input);
