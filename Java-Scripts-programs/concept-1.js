// Write Properties in JavaScript

const person = {
    name: "Snehasish",
    age: 30,
    location: "Kolkata",
    greet: function () {
        console.log("Hello, this is " + this.name)
    }
};

console.log(person.location);
console.log(person["age"]);
person.greet();

// Another way to Write Properties in JavaScript
const test = {};
test.street = "M.B Road, Tatkol";
test.place = "Birati";
test["pincode"] = 700049;

console.log(test);

// Anonymous Function in JavaScript -> no name, only function keyword
const greet = function () {
    return "Hello World!";
}
console.log(greet());

// let keyword -> Block scoped only. This is not scoped at the function level. 
function useOfLet() {
    let num = 1;
    if (num === 1) {
        let num = 2;
        console.log("[Let]: Inside If Block: " + num);
    }
    console.log("[Let]: Outside If Block: " + num);
}

useOfLet();

// var keyword. This is at the function level, not block scoped.
function useOfvar() {
    var value = 10;
    if (value === 10) {
        var value = 20;
        console.log("[Var]: Inside If Block: " + value);
    }
    console.log("[Var]: Outside If Block: " + value);
}

useOfvar();
