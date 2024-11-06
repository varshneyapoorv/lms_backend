const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
    title :{
        required : true,
        unique : true,
        type : String,
    },
    slug : {
        required : true,
        type : String,
        unique : true,
        index : true,
    },
    tutorialCategory : {
        type : String,
        // ref : "TutorialCategory",
        require : true,
    },
    tutorialCategorySlug : {
        type : String,
        // ref : "TutorialCategory",
        require : true,
    },
    topicName : {
        required : true,
        unique : true,
        type : String,
    
    },
    content : {
        required : true,
        type : String,
    },
    keywords : {
        type : [],
        required : true,
    }

},{
    timestamps : true
});


module.exports = mongoose.model('Tutorial', tutorialSchema);