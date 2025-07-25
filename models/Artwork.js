const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artworkSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    image: {
      url: {
        type: String,
        required: true,
        trim: true,
        match: [/^https?:\/\/.+/, "Please enter a valid URL"]
      },
      filename: { type: String, required: true, trim: true }
    }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Artwork = mongoose.model("Artwork", artworkSchema);
module.exports = Artwork;
