import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWishlist } from "@/context/WishlistContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [localWishlist, setLocalWishlist] = useState([]);

  useEffect(() => {
    // Load wishlist from localStorage on component mount
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setLocalWishlist(savedWishlist);
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = localWishlist.filter((item) => item._id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setLocalWishlist(updatedWishlist);
    removeFromWishlist(productId);
    toast.success("Product removed from wishlist.");
  };

  return (
    <div className="">
      {localWishlist.length === 0 ? (
        <p className="text-center py-[14rem] lg:py-[16rem]">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="mt-[10rem] grid lg:grid-cols-4 gap-4">
          {localWishlist.map((item) => (
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
              <button onClick={() => handleRemoveFromWishlist(item._id)}>
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
