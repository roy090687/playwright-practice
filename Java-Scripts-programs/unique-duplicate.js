function unique(arr) {
    let mySet = new Set();
    for (let num of arr) {
        mySet.add(num);
    }
    return Array.from(mySet);
}

function duplicates(arr) {
    let seen = new Set();
    let duplicates = new Set();
    for (let num of arr) {
        if (seen.has(num)) {
            duplicates.add(num);
        } else {
            seen.add(num);
        }
    }

    return Array.from(duplicates);
}

let arr = [2, 4, 10, 2, 1, 5, 4, 1, 3, 1, 15, 4];
let unique_result = unique(arr);
let duplicate_result = duplicates(arr);

console.log("Unique List: " + unique_result);
console.log("Duplicate List: " + duplicate_result);