import { useCustomContext } from "@/context/Customcontext";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/pagination";
import Modal from "react-modal";
import Link from "next/link";

const ProductCard = ({ slug,images, title, price, button }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index) => {
    setModalIsOpen(true);
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className=" w-full shadow-md rounded-md  ">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay
        modules={[Pagination, Autoplay]}
        onSwiper={(swiper) => console.log(swiper)}
        pagination={{ clickable: true }}
        className="h-48 "
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index} onClick={() => openModal(index)}>
            <Image
              src={image}
              width={347.5}
              height={496.25}
              alt={`Product ${index + 1}`}
              className="h-full w-full object-cover productSlider"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-between p-2 mt-4">
        <div>
          <h2 className="lg:text-lg font-semibold mt-2">{title}</h2>
          <p className="text-gray-600 md:text-[15px] text-[12px]">N{price}</p>
        </div>
        <Link href={`/products/${slug}`}>
          <button className="bg-primary px-4 text-[12px] md:text-[15px] rounded-md py-2 text-white">
            View
          </button>
        </Link>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Product Image Modal"
        ariaHideApp={false} // Fix for modal in Next.js
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color of the overlay
            zIndex: 9999, // Set a high z-index to appear on top
          },
          content: {
            padding: 0,
            border: "none",
            borderRadius: "8px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            maxHeight: "68%",
            width: "100%",
            height: "100%",
          },
        }}
      >
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          initialSlide={selectedImageIndex}
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                width={347.5}
                height={496.25}
                alt={`Product ${index + 1}`}
                className=""
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-dark"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const { isRightOpen, openRight, closeRight } = useCustomContext();

  return (
    <div>
      <div>
        <p className="text-center text-[14px] lg:text-left">83 products</p>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          {isRightOpen && <div className="overlay" onClick={closeRight}></div>}
          {isRightOpen && (
            <div
              className={`${
                isRightOpen ? "right-0 transition-all  " : "-right-full "
              } fixed z-10 bottom-0 w-[70%] bg-opacity-30 bg-dark/30 max-w-[32rem] h-screen transition-all`}
            >
              <div className="flex flex-col justify-between   items-start leading-[3rem] bg-white opacity-1 h-full   w-[130%] ">
                <div className="overflow-y-auto w-full overflow-x-hidden ">
                  <button
                    onClick={closeRight}
                    className="px-6 py-2 mt-[4rem] text-dark"
                  >
                    <svg viewBox="0 0 24 24" width="30" height="30">
                      <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
                    </svg>
                  </button>
                  <h1>hheje</h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
