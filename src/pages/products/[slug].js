import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Chat from "@/components/Chat/Chat";
import { useCustomContext } from "@/context/Customcontext";
import { getPhoneFromLocalStorage, getPhoneFromLocalStorageLogin } from "@/utils/Localstorage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [mainMedia, setMainMedia] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef(null);
  const { isBottomOpen, openBottom, closeBottom } = useCustomContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/${slug}`);
        const data = await response.json();
        setProduct(data);
        setMainMedia(data.images[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleToggleChat = () => {
    const storedPhone = getPhoneFromLocalStorage() || getPhoneFromLocalStorageLogin();
    if (!storedPhone) {
      toast.error("Please log in to create an order.");
      router.push("/"); // Navigate to the homepage
    } else {
      setShowChat(!showChat);
    }
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
        <div className="flex flex-col items-center">
          <div className="w-full h-auto">
            {mainMedia && (
              <>
                {typeof mainMedia === "string" && mainMedia.endsWith(".mp4") ? (
                  <video
                    src={mainMedia}
                    controls
                    className="max-w-full max-h-full"
                  />
                ) : (
                  <img
                    src={mainMedia}
                    alt={product.title}
                    className="max-w-full max-h-full"
                  />
                )}
              </>
            )}
          </div>
          <div className="flex mt-4 space-x-2">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover cursor-pointer"
                onClick={() => setMainMedia(image)}
              />
            ))}
            {product.video && product.video.map((video, index) => (
              <video
                key={index}
                className="w-20 h-20 object-cover cursor-pointer"
                onClick={() => setMainMedia(video)}
              >
                <source src={video} type="video/mp4" />
              </video>
            ))}
          </div>
        </div>
        <div className="w-[50%]" ref={chatRef}>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-gray-700 mt-2">{product.description}</p>
          <p className="text-xl font-bold mt-2">N{product.price}</p>
          <button
            onClick={handleToggleChat}
            className="bg-blue-500 hidden lg:block text-white p-2 mb-[8rem] rounded mt-4"
          >
            Create Order
          </button>
          {/* mobile */}
          <button
            onClick={handleToggleChat}
            className="bg-blue-500 lg:hidden block text-white p-2 mb-[8rem] rounded mt-4"
          >
            Create Order
          </button>

          {showChat && (
            <div className="absolute z-10 w-1/2 hidden lg:block right-0 h-[700px] bottom-0 overflow-hidden bg-light border-r">
              <Chat
                productName={product.slug}
                procedures={product.procedures[0]}
                images={product.images[0]}
                phoneNumber={getPhoneFromLocalStorage() || getPhoneFromLocalStorageLogin()}
              />
            </div>
          )}

          {showChat && (
            <div className="absolute z-10 w-[90%] lg:hidden block mx-auto bottom-0 h-[700px] top-20 overflow-hidden bg-light border-r">
              <Chat
                productName={product.slug}
                procedures={product.procedures.join(", ")}
                images={product.images[0]}
                phoneNumber={getPhoneFromLocalStorage()|| getPhoneFromLocalStorageLogin()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
