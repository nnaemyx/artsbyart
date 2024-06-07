import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Modal from "react-modal";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

const CollectionDetail = ({ slug }) => {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ images: [], video: null });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/category/${category}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  const openModal = (images, video) => {
    setModalContent({ images, video });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!products.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-[5rem] mb-[5rem] lg:mt-[12rem] mx-6">
      <h1 className="text-2xl font-semibold mb-4">{category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="shadow-md rounded-md p-4">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              autoplay
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              className="w-full h-64 cursor-pointer"
              onClick={() => openModal(product.images, product.video)}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
              {product.video && (
                <SwiperSlide key={product.video}>
                  <video
                    width="100%"
                    height="100%"
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    loop
                    muted
                  >
                    <source src={product.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </SwiperSlide>
              )}
            </Swiper>
            <div className="flex items-center justify-between p-2 mt-4">
              <div>
                <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                <p className="text-gray-600">N{product.price}</p>
              </div>
              <Link href={`/products/${product.slug}`}>
                <button className="bg-primary px-4 text-[12px] md:text-[15px] rounded-md py-2 text-white">
                  View
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Product Media Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 9999,
          },
          content: {
            padding: 0,
            border: "none",
            borderRadius: "8px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            maxHeight: "90%",
            width: "60%",
            height: "60%",
            overflowY: "scroll",
          },
        }}
      >
        <div className="p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-dark"
          >
            Close
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modalContent.images.map((image, index) => (
              <div key={index} className="w-full h-full">
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {modalContent.video && (
              <div className="w-full h-full">
                <video className="w-full h-auto" controls>
                  <source src={modalContent.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CollectionDetail;
