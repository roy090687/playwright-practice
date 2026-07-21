function printDuplicates(input) {
    let duplicates = {};
    for (let ch of input) {
        if (duplicates[ch]) {
            duplicates[ch] = duplicates[ch] + 1;
        }
        else {
            duplicates[ch] = 1;
        }
    }
    for (let key in duplicates) {
        if (duplicates[key] > 1) {
            console.log("Character: " + key + ", Count: " + duplicates[key])
        }
    }

}

printDuplicates("programming");
