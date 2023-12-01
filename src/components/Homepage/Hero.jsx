import { motion, useAnimation } from "framer-motion";
import { useEffect} from "react";
import { images, videos } from "@/data";

const Hero = () => {
  const controls = useAnimation();




  useEffect(() => {
    const totalWidth = -100 * 12; // Adjust the multiplier based on the width of one image

    const scrollAnimation = async () => {
      await controls.start({ x: 0 });
      controls.start({
        x: totalWidth,
        transition: { duration: 20, ease: "linear", repeat: Infinity },
      });
    };

    scrollAnimation();
  }, [controls]);

  return (
    <div>
      <motion.div className="hero-container  lg:mt-[8rem] mt-[4rem] h-[10rem] lg:h-[10rem]">
        {images.map((image, index) => (
          <motion.img
            animate={controls}
            key={index}
            src={image.url}
            alt={image.alt}
            style={{ width: "100%" }}
          />
        ))}
      </motion.div>
      <motion.div className="hero-container  h-[10rem]  lg:h-[10rem]">
        {videos.map((video, index) => (
          <motion.video key={index} animate={controls}  className="w-full" autoPlay muted loop>
            <source src={video.url} type="video/mp4" />
          </motion.video>
        ))}
      </motion.div>
      <div className="bg-dark px-4 py-2 text-center text-white">
        <h1 className="text-[12px] font-opensans">All jobs and orders are legally protected by our <span className="italic text-primary">terms & conditions</span></h1>
      </div>
    </div>
  );
};

export default Hero;
