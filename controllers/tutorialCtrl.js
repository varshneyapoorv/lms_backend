const { default: slugify } = require("slugify");
const Tutorial = require("../models/tutorialModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../config/validateMongoDbId");



const postTutorial = asyncHandler(async (req, res) => {
    try {
        // If the title is provided, generate a slug
        if (req.body.title) {
            req.body.slug = slugify(req.body.title.toLowerCase());
        }

        // If the tutorialCategory is provided, generate a slug for the category
        if (req.body.
            tutorialCategory) {
            req.body.
            tutorialCategorySlug = slugify(req.body.
                tutorialCategory.toLowerCase());
        }

        // Create the tutorial in the database
        const postTut = await Tutorial.create(req.body);

        // Send a success response
        res.status(201).json({
            status: true,
            message: "Tutorial Created Successfully!",
            postTut,
        });
    } catch (error) {
        // Send a detailed error response in case of failure
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong while creating the tutorial",
        });
    }
});


const getATutorial = asyncHandler (async (req,res)=>{
    const {slug,type} = req.params;
    try {
        const getATutData = await Tutorial.findOne({
            slug : slug,
            tutorialCategorySlug : type,
        });
        const tutorialTopics = await Tutorial.find({tutorialCategorySlug : type})
        .select("topicName title slug tutorialCategorySlug")
        .sort("createdAt");
        res.status(200).json({
            status : true,
            message : "Data Fetched!",
            getATutData,
            tutorialTopics,
        })
    } catch (error) {
        throw new Error(error)
    }
});


const updateTutorial = asyncHandler(async ( req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title.toLowerCase());
        }
        if (req.body.
            tutorialCategory) {
            req.body.
            tutorialCategorySlug = slugify(req.body.
                tutorialCategory.toLowerCase());
        }
        const updateTut = await Tutorial.findByIdAndUpdate(id, req.body, {
            new:true,
        });

        // Send a success response
        res.status(201).json({
            status: true,
            message: "Tutorial Updated Successfully!",
            updateTut,
        });
    } catch (error) {
        throw new Error(error)
    }
});


const deleteTutorial = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    try {
        const deleteTut = await Tutorial.findByIdAndDelete(id);
        res.status(200).json({
            status : true,
            message : "Tutorial Deleted!",
        })
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    postTutorial,
    getATutorial,
    updateTutorial,
    deleteTutorial,
}