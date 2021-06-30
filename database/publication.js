const mongoose = require("mongoose");

// Schema 
const PublicationSchema ={
    id: Number,
    name:String,
    books:[String]
}

const PublicationModel = mongoose.model("author",PublicationSchema);

module.exports = PublicationModel;