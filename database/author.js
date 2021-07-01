const mongoose = require("mongoose");

// Schema 
const AuthorSchema ={
    id: Number,
    name:String,
    books:[String]
}

const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;