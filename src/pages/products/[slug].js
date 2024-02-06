import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Chat from "@/components/Chat/Chat";
import { useCustomContext } from "@/context/Customcontext";

const ProductDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef(null);
  const { isBottomOpen, openBottom, closeBottom } = useCustomContext();

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

  const handleToggleChat = () => {
    setShowChat(!showChat); // Toggle the value
  };

 

  const handleClickOutsideChat = (event) => {
    if (chatRef.current && !chatRef.current.contains(event.target)) {
      setShowChat(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideChat);

    return () => {
      document.removeEventListener("click", handleClickOutsideChat);
    };
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-4 lg:mt-[11rem]">
      <div className="flex flex-col px-6 md:px-0 md:flex-row gap-12">
        <div className="">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-[400px] lg:h-[800px]"
          />
        </div>
        <div className="flex-1" ref={chatRef}>
          <p className="text-gray-600 font-opensans font-semibold">
            {product.brand}
          </p>
          <h1 className="font-futura md:text-[56px]">{product.title}</h1>
          <p className="font-opensans md:text-[26px]">N{product.price}</p>
          <hr className="w-full" />
          <p className="text-gray-600 mt-8 ">{product.description}</p>

          {/* Button to toggle chat, desktop */}
          <button
            onClick={handleToggleChat}
            className="bg-blue-500 hidden lg:block text-white p-2 mb-[8rem] rounded mt-4"
          >
            Create Order
          </button>
          {/* moibile  */}
          <button
            onClick={handleToggleChat}
            className="bg-blue-500 lg:hidden block text-white p-2 mb-[8rem] rounded mt-4"
          >
            Create Order
          </button>

          {/* Display chat component based on showChat state */}
          {showChat && (
            <div className="absolute z-10 w-1/2 hidden lg:block right-0 h-[700px]  bottom-0 overflow-hidden  bg-light border-r">
              {/* Your chat component content goes here */}
              <Chat product={product} />
            </div>
          )}

          {showChat && (
            <div className="absolute z-10 w-[90%] lg:hidden block mx-auto bottom-0 h-[600px] top-20 overflow-hidden  bg-light border-r">
              {/* Your chat component content goes here */}
              <Chat product={product} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
