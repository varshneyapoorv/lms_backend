const { default: slugify } = require("slugify");
const TutorialCategory = require("../models/tutCategory");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../config/validateMongoDbId");



const postTutorialCategory = asyncHandler (async (req,res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title.toLowerCase());
        }
        const postTutCat = await TutorialCategory.create(req.body);
        res.status(200).json({
            status : true,
            message : "TuTorial Category Created Successfully",
        })
    } catch (error) {
        throw new Error(error);
    }
});

const getAllTutCategories = asyncHandler(async (req,res)=>{
    try {
        const allTutCat = await TutorialCategory.find();
        res.status(200).json({
            status : true,
            message : "Tutorials Category Fetched Successfully",
            allTutCat,
        })
    } catch (error) {
        throw new Error(error);
    }
});




const deleteATutCat = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
       const deleteTutCat = await TutorialCategory.findByIdAndDelete(id);
       res.status(200).json({
        status : true,
        message : "Category Deleted",
        deleteATutCat,
    })
    } catch (error) {
       throw new Error(error);
    }

});

const updateATutCat = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ID
    validateMongodbId(id);

    try {
        // If title is provided, generate a slug based on the title
        if (req.body.title) {
            req.body.slug = slugify(req.body.title.toLowerCase());
        }

        // Find and update the tutorial category
        const updateTutCat = await TutorialCategory.findByIdAndUpdate(id, req.body, { new: true });

        // If no category is found
        if (!updateTutCat) {
            return res.status(404).json({
                status: false,
                message: "Tutorial Category not found",
            });
        }

        // Return the updated category
        res.status(200).json({
            status: true,
            message: "Category Updated",
            updateTutCat,
        });
    } catch (error) {
        // Catch and handle errors
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});



const getATutCat = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const getTutCat = await TutorialCategory.findById(id);
       res.status(200).json({
        status: true,
        message: "Category Fetched",
        getTutCat,
    });
    } catch (error) {
       throw new Error(error);
    }

});



module.exports = {
    postTutorialCategory,
    getAllTutCategories,
    deleteATutCat,
    getATutCat,
    updateATutCat,
}