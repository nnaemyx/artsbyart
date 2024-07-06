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
        <div className="mt-[10rem] grid grid-cols-4">
          {wishlist.map((item) => (
            <div key={item.id} className="flex">
              <Link href={`/products/${item.slug}`} className="flex">
                <img src={item.images[0]} className="w-[200px]" alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.price}</p>
                </div>
              </Link>
              <button onClick={() => removeFromWishlist(item.id)}>
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
