const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        return res.status(400)
        .send('You should send your username and password')
    }

    const isUserNameAlreadyExist = 
        users.find(user => user.usename === username);
    if(isUserNameAlreadyExist) {
        return res.status(400)
        .send('There is another customer with the same username');
    }

    users.push({ username, password });
    return res.status(200)
    .send('Customer successfully registered, you can now login');
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            resolve(books);
        })
    }

    try {
        const allBooks = await getBooks()
        return res.status(200).send(JSON.stringify(allBooks));
    } catch(err) {
        return res.status(400).send(`${err}`);
    }
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const getBookByIsbn = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = Object.values(books).find(b => b.isbn === isbn);
            if(!book) {
                reject(`Not found any book with isbn: ${isbn}`)
            }
            resolve(book)
        });
    }

    const isbn = +req.params.isbn
    try {
        const book = await getBookByIsbn(isbn)
        return res.status(200).send(JSON.stringify(book));
    } catch(err) {
        return res.status(400).send(`${err}`);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const getBookByAuthor = (author) => {
        return new Promise((resolve, reject) => {
            const booksByAuthor = Object.values(books)
                .filter(b => b.author === author);
            if(booksByAuthor.length === 0) {
                reject(`Not found any book with author: ${author}`)
            }
            resolve(booksByAuthor)
        });
    }

    const author = req.params.author
    try {
        const booksByAuthor = await getBookByAuthor(author)
        return res.status(200).send(JSON.stringify({
            booksByAuthor
        }));
    } catch(err) {
        return res.status(400).send(`${err}`);
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const getBookByTitle = (title) => {
        return new Promise((resolve, reject) => {
            const booksByTitle = Object.values(books)
                .filter(b => b.title === title);
            if(booksByTitle.length === 0) {
                reject(`Not found any book with title: ${title}`)
            }
            resolve(booksByTitle)
        });
    }

    const title = req.params.title
    try {
        const booksByTitle = await getBookByTitle(title)
        return res.status(200).send(JSON.stringify({
            booksByTitle
        }));
    } catch(err) {
        return res.status(400).send(`${err}`);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = +req.params.isbn
    const book = Object
        .values(books)
        .find(b => b.isbn === isbn);

    if(!book) {
        return res
        .status(404)
        .send(`Not found any book with isbn: ${isbn}`);
    }

    return res .status(200).send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
