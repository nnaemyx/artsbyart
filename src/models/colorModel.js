const mongoose = require("mongoose"); // Erase if already required
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
if (!mongoose.models.Color) {
  const colorSchema = Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      hex: {
        type: String, // You can use a string to store the hex color value
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  mongoose.model("Color", colorSchema);
}

module.exports = mongoose.model("Color");