const mongoose = require("mongoose");
//create a schema
const BookSchema = {
    ISBN : String,
    title:String,
    authors:[Number],
    language:String,
    pubDate:String,
    numOfPage:Number,
    category:[String],
    publications:Number
}

// model
const BookModel = mongoose.model("books",BookSchema);

// export
module.exports = BookModel;