import mongoose from "mongoose";
const Schema = mongoose.Schema;

if (!mongoose.models.Integrated) {
  const integratedSchema = new Schema(
    {
      password: {
        type: String,
        required: [true, "Please enter a valid password"],
        minLength: [6, "Password must be at least 6 characters"],
      },
      role: {
        type: String,
        required: [true],
        default: "customer",
        enum: ["customer", "admin"],
      },
      phone: {
        type: String,
        required: [true],
        default: "+234",
      },
      resetToken: {
        type: String,
      },
      resetTokenExpires: {
        type: String,
      },
      cart: {
        type: Array,
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );
  mongoose.model("Integrated", integratedSchema);
}

module.exports = mongoose.model("Integrated");
