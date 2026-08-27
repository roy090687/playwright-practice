function getUnique(arr) {
    let unique = new Set(arr);
    console.log(unique);
    console.log("Array Format => ", [...unique]);  // convert Set to and Array using spread operator in JS.
}

function getDuplicates(arr) {
    let seen = new Set();
    let duplicates = new Set();

    for (let num of arr) {
        if (seen.has(num)) {
            duplicates.add(num);
        } else {
            seen.add(num);
        }
    }
    console.log(duplicates);
    console.log([...duplicates]);
}

let arr = [2, 4, 10, 2, 1, 5, 4, 1, 3, 1, 15, 4];
getUnique(arr);
getDuplicates(arr);
