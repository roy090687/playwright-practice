class Fibonacci {
    constructor(n) {
        this.n = n;
    }

    display() {
        let a = 0, b = 1;
        console.log(`Fibonacci series up to ${this.n}th terms:`);

        let output = ""
        for (let i = 0; i < this.n; i++) {
            output += a + " ";
            let next = a + b;
            a = b;
            b = next;
        }
        console.log(output.trim());
    }
}

// --- Usage ---
const fib10 = new Fibonacci(10);
fib10.display();