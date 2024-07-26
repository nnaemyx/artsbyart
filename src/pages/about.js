/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <>
      <div className="relative h-[250px] w-full">
        <Image
          src="https://res.cloudinary.com/dgms1mpbw/image/upload/v1718978778/artbyart/aqhduqtvl19xxvriuij1.jpg"
          alt="About us image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <h1 className="text-white text-4xl font-bold">About Us</h1>
        </div>
      </div>
      <div className="px-4 py-[86px]">
        <h1 className="text-center font-opensans lg:text-[25px] font-semibold">
          Welcome to Artsbyart Design And Print,{" "}
          <span className="text-primary">where You Imagine, We Create!</span>
        </h1>
        <div className="mt-[40px] space-y-[20px] lg:w-[65%] w-auto mx-auto font-opensans">
          <p>
            At Artsbyart Design And Print, we believe in the power of visual
            storytelling. We are a premier design, printing, and branding
            organization dedicated to transforming your ideas into compelling
            visual narratives. Our team of passionate artists, innovative
            designers, and attention to details printers work collaboratively to
            bring your brand to life.
          </p>
          <div>
            <h2 className="font-semibold">Our Mission</h2>
            <p>
              Our mission is to empower businesses and individuals with visually
              stunning and impactful designs that resonate with their audience.
              We aim to deliver exceptional quality and craftsmanship in every
              project, ensuring your vision is realized with precision and
              creativity.
            </p>
          </div>
          <div className="space-y-[10px]">
            <h2 className="font-semibold"> What We Do</h2>
            <p>
              <span className="font-semibold">Design:</span> Our design team
              excels in creating unique and memorable brand identities. From
              logos and business cards to marketing materials and digital
              graphics, we craft designs that capture the essence of your brand.
            </p>
            <p>
              <span className="font-semibold">Printing:</span> With
              state-of-the-art printing technology, we produce high-quality
              prints that enhance the visual appeal of your designs. Whether
              it's brochures, posters, banners, or custom 3D merchandise, our
              printing services ensure vibrant colors and sharp details.
            </p>
            <p>
              <span className="font-semibold">Branding:</span> We specialize in
              building cohesive and powerful brand identities. Our branding
              services include strategy development, brand messaging, and visual
              identity creation, helping you establish a strong and consistent
              brand presence that resolute with your products.
            </p>
          </div>
          <div className="space-y-[10px]">
            <h2 className="font-semibold">Why Choose Artsbyart Design?</h2>
            <p>
              Exceptional Quality and Craftsmanship: We are committed to
              delivering top-notch quality in every aspect of our work. Our
              attention to detail and dedication to excellence ensure that your
              projects are completed to the highest standards.
            </p>
            <p>
              Customized Solutions: We understand that every client is unique.
              Our solutions are tailored to meet your specific needs, ensuring
              that your brand stands out in the marketplace.
            </p>
            <p>
              Innovative and Sustainable Practices: We embrace innovation and
              sustainability in our processes. By using eco-friendly materials
              and the latest technology, we not only enhance the quality of our
              products but also contribute to a greener future.
            </p>
            <p>
              Comprehensive And Exceptional Maintenance Services: As a
              full-service art, signage, and branding organization, we offer a
              wide array of services under one roof. Our expertise spans graphic
              design, logo creation, large format printing, digital and offset
              printing, we offer a complete suite of services to support your
              business growth and success, custom art commissions, and much
              more. This comprehensive approach allows us to manage your entire
              project seamlessly, saving you time and effort. Also our
              maintenance services cover a wide range of needs to keep your art,
              signage, and branding elements in perfect condition. Which
              includes regular inspections, minor repairs, and adjustments if
              needed. We take proactive measures to address any potential issues
              before they become problems, ensuring your investment remains in
              top shape.
            </p>
            <p>
              Escrow Services for Security and Peace of Mind: "Our foremost
              priority is delivering exceptional service to you, rather than
              focusing on your financial contributions." We are committed to
              ensuring our clients feel secure throughout the project. Artsbyart
              offers escrow services to protect your investment. Payments are
              held in escrow and only released when you are fully satisfied with
              the completed work. We believe this will help you add a layer of
              financial security, build trust and provide peace of mind in the
              course of the projects.
            </p>
            <p>
              Client Satisfaction: Our proven track record and numerous
              satisfied clients are a testament to our dedication and expertise.
              We strive to build long-lasting relationships based on trust,
              reliability, and outstanding service.
            </p>
            <p>
              At Artsbyart Design And Print, your vision is our inspiration. Let
              us help you create a brand that not only looks amazing but also
              tells your unique story
            </p>
            <p>
              Explore our portfolio, meet our team, and discover how we can
              bring your ideas to life. Welcome to a world of creativity,
              innovation, and excellence. Welcome to Artsbyart Design And Print.
              (You Imagine, We Create!)
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
