const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
let reviewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
     
    },
    post:{
        type:String,
        required:true,
    },
    mobile:{
        reviewerImage:String,
        required:true,
        default : "",
    },
    comment:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Review', reviewSchema);