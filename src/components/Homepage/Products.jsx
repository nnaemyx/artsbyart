import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

const CollectionCard = ({ category, images, video, priceRange }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleViewClick = () => {
    router.push(`/collection/${category}`);
  };
  return (
    <div className="w-full shadow-md rounded-md">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        className="h-48 cursor-pointer"
        onClick={openModal}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              width={400}
              height={400}
              alt={`Product ${index + 1}`}
              className="h-full w-full object-cover productSlider"
            />
          </SwiperSlide>
        ))}
        {video.map((video, index) => (
          <SwiperSlide key={index}>
            <video
              width={400}
              height={400}
              className="h-full w-full object-cover"
              autoPlay
              muted
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-between p-2 mt-4">
        <div>
          <h2 className="lg:text-lg font-semibold mt-2">{category}</h2>
          <p className="text-gray-600 md:text-[15px] text-[12px]">
            {priceRange}
          </p>
        </div>
        <button
          onClick={handleViewClick}
          className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
        >
          View
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Collection Media Modal"
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
            {images.map((image, index) => (
              <div key={index} className="w-full h-full">
                <Image
                  src={image}
                  width={1800}
                  height={800}
                  alt={`Collection Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {video.map((video, index) => (
              <div key={index} className="w-full h-full">
                <video className="w-full h-auto" autoPlay muted>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Products = () => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/product");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const calculatePriceRange = (prices) => {
    if (prices.length === 0) return "N/A";

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return `N${minPrice}-N${maxPrice}`;
  };

  return (
    <div className="px-12 mt-12 mb-20">
      {Object.keys(categories).map((category) => (
        <div
          key={category}
          className="grid grid-cols-1 font-opensans sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <CollectionCard
            category={category}
            images={categories[category].images}
            video={categories[category].video}
            priceRange={calculatePriceRange(categories[category].price)}
          />
        </div>
      ))}
      <Link href="/shop">
        <button className="mt-[64px] mx-auto  flex justify-center  text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[50px] tracking-[1.5px] py-[18px]">
          View All
        </button>
      </Link>
    </div>
  );
};

export default Products;
