class Book {
    constructor(title, author, year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }

    getInfo() {
        return `${this.title} by ${this.author} (${this.year})`;
    }
}

class Library {
    constructor(name) {
        this.name = name;
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
        console.log(`Added: ${book.getInfo()}`);
    }

    searchByAuthor(authorName) {
        return this.books.filter(book => book.author.toLowerCase() === authorName.toLowerCase());
    }

    display() {
        console.log(`Library: ${this.name}`);
        this.books.forEach(book => console.log(book.getInfo()));
    }
}

const myLib = new Library("Snehasish's Library");

const b1 = new Book("Clean Code", "Robert C. Martin", 2008);
const b2 = new Book("Effective JavaScript", "David Herman", 2012);
const b3 = new Book("JavaScript: The Good Parts", "Douglas Crockford", 2008);
const b4 = new Book("Typecript: UI Development", "Douglas Crockford", 2010);

myLib.addBook(b1);
myLib.addBook(b2);
myLib.addBook(b3);
myLib.addBook(b4);

console.log("My Library Setup: ", myLib);

myLib.display();

const results = myLib.searchByAuthor('Douglas Crockford');
console.log("Seacrh Result:");
results.forEach(book => console.log(book.getInfo()));


