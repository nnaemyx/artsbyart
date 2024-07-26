import React from "react";
import Image from "next/image";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 4.8472226, 
  lng: 6.974604, 
};

const Contact = () => {
  return (
    <div>
      <div className="relative h-[250px] w-full">
        <Image
          src="https://res.cloudinary.com/dgms1mpbw/image/upload/v1718978778/artbyart/aqhduqtvl19xxvriuij1.jpg"
          alt="About us image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <h1 className="text-white text-4xl font-bold">Contact Us</h1>
        </div>
      </div>
      <div className="mt-4 px-6">
        <div className="mb-6">
          <h1 className="lg:text-[25px] font-semibold font-opensans text-center">
            Our Location
          </h1>
          <p className="text-center font-opensans">
            Set your Location and Find us
          </p>
        </div>
        <LoadScript googleMapsApiKey="AIzaSyCR9r_P9DQh88gQx2yif72HvZz1wImcKBg">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
        <div className="mt-[40px] mb-[40px]">
            <h2 className="font-opensans text-[25px] font-semibold">Reach us via</h2>
            <div>
                <p>customersupport@artsbyart.com</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
