const mongoose = require("mongoose");

//create a schema
const BookSchema =mongoose.Schema( {
    ISBN : {
        type : String,
        required:true,
        minLength:8,
        maxLength:10
    },
    title:{
        type:String,
        required:true,

    },
    authors:{
        type:[Number],
        required:true,
        },
    language:{
        type:String,
        required:true,

    },
    pubDate:{
        type:String,
        required:true,

    },
    numOfPage:{
        type:Number,
        required:true,

    },
    category:{
        type:[String],
        required:true,
    },
    publications:{
        type:Number,
        required:true,

    }
});

// model
const BookModel = mongoose.model("books",BookSchema);

// export
module.exports = BookModel;