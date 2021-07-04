require ('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const database = require('./database/index.js');

// Including models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Microservices Routes
const Books = require('./API/Book');
const Authors = require('./API/Author');
const Publications = require('./API/Publication');


const shapeAI  = express();

shapeAI.use(express.json());


// connecting the mongodb
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>console.log("Connection established!"));



// Initializing Microservices
shapeAI.use("/book",Books);
shapeAI.use("/author",Authors);
shapeAI.use("/publication",Publications);






shapeAI.listen(8000,()=> console.log("Server is running sucessfully!..."));

