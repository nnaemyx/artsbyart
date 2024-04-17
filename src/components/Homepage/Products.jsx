import { products } from "@/data";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/pagination";
import Modal from "react-modal";
import Link from "next/link";

const ProductCard = ({ slug, images, title, price, button }) => {
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
              width={400}
              height={400}
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
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                width={1800}
                height={800}
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
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="px-12 mt-12 mb-20">
      <div>
        <h1 className="md:text-3xl font-futura text-center uppercase font-semibold mb-4">
          Our Products and Services
        </h1>
        <div className="grid grid-cols-1 font-opensans sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        <Link href="/shop">
          <button className="mt-[64px] mx-auto  flex justify-center  text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[50px] tracking-[1.5px] py-[18px]">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Products;
