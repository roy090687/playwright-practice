function reverseString(str) {
    let reversed = "";
    let len = str.length;
    for (let i = len - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

const input = "Snehasish";
const reversedOutput = reverseString(input);

console.log("Original:", input);
console.log("After Reverse:", reversedOutput);
