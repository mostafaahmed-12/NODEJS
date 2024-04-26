const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

const user = users.find((s) => s.username === username)


if(user){
  
  return true
}

return false


}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

const user = users.find((s) => s.username === username && s.password === password)

if(user){
  
  return true
}

return false
}


//only registered users can login 
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const isAuthenticated = authenticatedUser(username, password);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, 'mostafa');

  // Send the token in response
  res.status(200).json({ message: "Login successful", token });
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{

  const iid=parseInt(req.params.isbn)

  const u=req.session.username


  if(!isValid(u)){
    res.status(300).json({message: "invalid user"})
    return
  }

const book_user=books[iid]


  if (!book_user.reviews.hasOwnProperty(u)) {
    res.status(404).send('Review not found');
    return;
}
 

  
delete book_user.reviews[u]

res.status(200).send('Review deleted successfully');






})



regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  const review = req.query.review;

  if (!isValid(username)) {
      return res.status(400).json({ error: "Invalid user" });
  }

  if (!books[isbn]) {
      return res.status(404).json({ error: "Book not found" });
  }

  // Check if the user already has a review for this book
  if (books[isbn].reviews && books[isbn].reviews[username]) {
      // Modify the existing review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
  } else {
      // Add a new review
      books[isbn].reviews = { ...books[isbn].reviews, [username]: review };
      return res.status(200).json({ message: "Review added successfully" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
