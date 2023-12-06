import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProductDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-[11rem]">
      <div className="flex flex-col px-6 md:px-0 md:flex-row gap-12">
        <div className="">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-[800px]"
          />
        </div>
        <div className="flex-1">
          <p className="text-gray-600 font-opensans font-semibold">{product.brand}</p>
          <h1 className="font-futura md:text-[56px]">{product.title}</h1>
          <p className="font-opensans md:text-[26px]">N{product.price}</p>
          <hr className="w-full"/>
          <p className="text-gray-600 mt-8 ">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
