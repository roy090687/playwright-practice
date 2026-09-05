
// We can declare function inside JS object too.
let person = {
    name: "John",
    age: 30,
    greet: function () {
        console.log("Hi, I am " + this.name)
    }
}
console.log("Name = " + person.name);
person.greet();

// Annonymus fucntion (No name)
const foo = function(name){
    return "Hi, I am " + name;
}
console.log(foo("Snehasish"));

// Important Array concepts
let arr = [64, 25, 12];
arr.push(22);   // add at end → [64, 25, 12, 22]
arr.pop();      // remove last → [64, 25, 12]
arr.unshift(11); // add at start → [11, 64, 25, 12]
arr.shift();     // remove first → [64, 25, 12]
