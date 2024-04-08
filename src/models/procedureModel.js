const mongoose = require("mongoose");
const Schema = mongoose.Schema;

if (!mongoose.models.Procedure) {
  const procedureSchema = new Schema({
    description: String,
  });
  mongoose.model("Procedure", procedureSchema);
}

module.exports = mongoose.model("Procedure");