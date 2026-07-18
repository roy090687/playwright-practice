class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    display() {
        console.log(`Name: ${this.name}, Age: ${this.age}`);
    }

}

const s1 = new Student('Snehasish', 35);
s1.display();
