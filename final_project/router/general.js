const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();
const allbooks=Object.values(books)

public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
  }

  
   x=users.find((s)=>s.username==username)
   
   if (x) {
    return res.status(400).json({ error: "User already exists" });
}

  
users.push({username,password})

  res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {

  res.send(JSON.stringify(books))

 
});




// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const i=req.params.isbn

  const s=books[i]
res.send(JSON.stringify(s))


 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
const a=req.params.author
const book=allbooks.find((x)=>x.author=a)
res.send(JSON.stringify(book))

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   const  t=req.params.title
   book=allbooks.find((x)=>x.title=t)

   res.send(JSON.stringify(book))


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookReviews = books[isbn].reviews;
  res.send(JSON.stringify(bookReviews));


});

module.exports.general = public_users;
