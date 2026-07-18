const findDuplicateChars = (str) => {
    str = str.toLowerCase();
    const charMap = new Map();
    for (const ch of str) {
        if (charMap.has(ch)) {
            charMap.set(ch, charMap.get(ch) + 1);
        } else {
            charMap.set(ch, 1);
        }
    }
    // Print duplicates
    console.log("===== Duplicate characters with count =====");
    for (const [ch, count] of charMap) {
        if (count > 1) {
            console.log(`${ch} occurs for ${count} times`)
        }
    }
}

const input = "Snehasish";
findDuplicateChars(input);
