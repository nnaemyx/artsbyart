const mongoose = require("mongoose");
const Schema = mongoose.Schema;

if (!mongoose.models.Wishlist) {

    const wishlistSchema =  Schema(
      {
        products: [
          {
            type: Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
      },
      { timestamps: true }
    );
    mongoose.model("Wishlist", wishlistSchema);
}

module.exports = mongoose.model("Wishlist");
