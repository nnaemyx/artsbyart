import mongoose from "mongoose";
const Schema = mongoose.Schema;

if (!mongoose.models.Admin) {
  const adminSchema = new Schema(
    {
      email: {
        type: "string",
        required: true,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: [true, "Please enter a valid password"],
        minLength: [6, "Password must be at least 6 characters"],
      },
    },
    {
      timestamps: true,
    }
  );
  mongoose.model("Admin", adminSchema);
}

module.exports = mongoose.model("Admin");
