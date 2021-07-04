const mongoose = require("mongoose");

// Schema 
const AuthorSchema =mongoose.Schema({
    id: {
        type :Number,
        required:true,
        },
    name: {
        type: String,
        required:true,
        minLength:2,
        },
    books:{
        type:[String],
        required:true,
        minLength:[8],
        maxLength:[10]
        }
});

const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;