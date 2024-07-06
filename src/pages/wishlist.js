// pages/wishlist.js

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="">
      {wishlist.length === 0 ? (
        <p className="text-center py-[14rem] lg:py-[16rem]">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="mt-[10rem] grid lg:grid-cols-4 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="flex items-center border p-4">
              <Link href={`/products/${item.slug}`}>
                <div className="flex items-center space-x-4">
                  <img
                    src={item.images[0]}
                    className="w-[200px] h-[200px] object-cover"
                    alt={item.title}
                  />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.price}</p>
                  </div>
                </div>
              </Link>
              <button onClick={() => removeFromWishlist(item._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
