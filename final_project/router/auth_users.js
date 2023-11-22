const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    if(!username)  return false;
    return true;
}
const authenticatedUser = (username,password)=>{ 
    const user = users.find(user => 
            user.username === username && 
            user.password === password);
    if(user) return true;
    return false;
}
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if(isValid(username) && authenticatedUser(username, password)){
        const accessToken = jwt.sign({ username }, 'ASDF');
        req.session['accessToken'] = accessToken;

        return res.status(200)
            .send(JSON.stringify('Customer successfully logged in'));
    }
    return res.status(400).json("Your credentials aren't correct");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.username;
    const isbn = req.params.isbn;
    const review = req.query.review;
    let book = books[isbn];
    if(!book) {
        return res.status(404)
            .send(JSON.stringify(`There is no book with isbn ${username}`))
    }
    book.reviews[username] = review

    return res.status(200)
        .send(`The review for the book with ISBN ${isbn} has been added/updated`);
});

regd_users.delete("/auth/review/:isbn"), (req, res) => {
    const username = req.username;
    const isbn = +req.params.isbn;
    const book = books[isbn]
    if(!book) {
        return res.status(404)
            .send(JSON.stringify(`There is no book with isbn: ${isbn}`));
    }
    
    delete book.reviews[username];

    return res.status(200)
    .send(
        `Reviews for book with ISBN ${isbn} posted by the user ${username} deleted`)
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
