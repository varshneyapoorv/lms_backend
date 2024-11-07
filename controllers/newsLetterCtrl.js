const NewsLetter = require('../models/newsLetterModel');
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../config/validateMongoDbId");


const subscribe = asyncHandler(async (req, res) => {
    try {
        const newEmail = await NewsLetter.create(req.body);
        res.status(201).json({
            status: "success",
            message : "Subscribed to newsletter",
            count : newEmail.length,
            newEmail,
        })
    } catch (error) {
        throw new Error(error);
    }
});


const unsubscribe = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const deleteEmail = await NewsLetter.findByIdAndDelete(id);
        res.status(201).json({
            status: "success",
            message : "UnSubscribed to newsletter",
        })
    } catch (error) {
        throw new Error(error);
    }
});





module.exports = {subscribe, unsubscribe};