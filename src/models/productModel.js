const mongoose = require("mongoose"); // Erase if already required
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
if (!mongoose.models.Product) {
  const productSchema = Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
      },
      sold: {
        type: Number,
        default: 0,
      },
      images: {
        type: [String],
      },
      tags: String,
    },
    { timestamps: true }
  );

  mongoose.model("Product", productSchema);
}

//Export the model
module.exports = mongoose.model("Product");
