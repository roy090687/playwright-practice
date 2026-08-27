function getSecondHighestNumber(arr) {
    let first = second = Number.MIN_VALUE;
    const n = arr.length;
    if (n < 2)
        return "Invalid";
    for (let num of arr) {
        if (num > first) {
            second = first;
            first = num;
        }
        else if (num > second && num != first) {
            second = num;
        }
    }
    return second;
}

let input_arr = [5, 3, 10, 12, 7, 2];
let second_highest = getSecondHighestNumber(input_arr);
console.log(second_highest);
