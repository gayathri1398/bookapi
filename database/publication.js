const mongoose = require("mongoose");

// Schema 
const PublicationSchema = mongoose.Schema({
    id:{
    type: Number,
    required:true
    },
    name:{
        type:String,
        required:true
    },
    books:{
        type:[String],
        required:true,
        minLength:[8],
        maxLength:[10]
    }
});

const PublicationModel = mongoose.model("publication",PublicationSchema);

module.exports = PublicationModel;