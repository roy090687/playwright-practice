class Student {
    constructor(name, age, grades) {
        this.name = name;
        this.age = age;
        this.grades = grades;
    }

    getAverageGrades() {
        let sum = this.grades.reduce((acc, value) => acc + value, 0);
        return (sum / this.grades.length).toFixed(2);
    }

    display() {
        console.log(`Name: ${this.name}, Age: ${this.age}, Average Grade: ${this.getAverageGrades()}`);
    }
}


const students = [
    new Student('Snehasish', 35, [85, 90, 88]),
    new Student("Rahul", 25, [70, 75, 80]),
    new Student("Priya", 28, [95, 92, 98])
]
console.log("Student DB: ", students);

students.forEach(student => student.display());