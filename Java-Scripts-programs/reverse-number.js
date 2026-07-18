const reverseNumber = (number) => {
    let reverse = 0;
    while (number > 0) {
        let rem = number % 10;
        reverse = (reverse * 10) + rem;
        number = Math.floor(number / 10); 
    }
    return reverse;
}

const input = 1234;
console.log("O/P number is: ", reverseNumber(input));
