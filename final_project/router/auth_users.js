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
    const { username, password } = req.body.username;
    if(isValid(username) && authenticatedUser(username, password)){
        const accessToken = jwt.sign({ username }, 'ASDF');
        req.session.data.accessToken = accessToken;

        return res.status(200)
            .send(JSON.stringify('You logged in successfully'));
    }
    return res.status(400).json("You aren't registered to the system");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.username;
    const isbn = +req.params.isbn;
    const review = req.query.review;
    let book = Object.values(books).find(book => book.isbn === isbn);
    if(!book) {
        return res.status(404)
            .send(JSON.stringify(`There is no book with isbn ${username}`))
    }
    book.reviews = { ...book.reviews, [username]: review };

    return res.status(200).json(JSON.stringify(book.reviews));
});

regd_users.delete("/auth/review/:isbn"), (req, res) => {
    const username = req.username;
    const isbn = +req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if(!book) {
        return res.status(404)
            .send(JSON.stringify(`There is no book with isbn: ${isbn}`));
    }
    const reviewsWithoutReviewerReview = 
        Object.keys(book.reviews)
                .filter(reviewer => reviewer !== username);
    book.reviews = reviewsWithoutReviewerReview;

    return res.status(200)
        .send('You have deleted your reveiw successfully')
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
