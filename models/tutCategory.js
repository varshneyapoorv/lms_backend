const mongoose = require("mongoose");

let tutCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // Ensures titles are unique
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Slug is unique and indexed by default
      index: true, // Optional: no need to use this since 'unique' already creates an index
    },
    image: {
      type: String,
      default: "https://t3.ftcdn.net/jpg/04/60/01/36/360_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export the model
module.exports = mongoose.model("TutorialCategory", tutCategorySchema);
