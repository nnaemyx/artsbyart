const mongoose = require("mongoose"); // Erase if already required
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
if (!mongoose.models.OTP) {
  const otpSchema = Schema(
    {
        phone: {
            type: String,
            required: true,
          },
          otp: {
            type: String,
            required: true,
          },
          expiry: {
            type: Date,
            default: () => Date.now() + 5 * 60 * 1000, // Set default expiry time to 5 minutes from now
          },
    },
    {
      timestamps: true,
    }
  );
  mongoose.model("OTP", otpSchema);
}

module.exports = mongoose.model("OTP");