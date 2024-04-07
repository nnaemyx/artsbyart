const mongoose = require("mongoose"); // Erase if already required
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
if (!mongoose.models.Category) {
  const categorySchema = Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );
  mongoose.model("Category", categorySchema);
}

module.exports = mongoose.model("Category");