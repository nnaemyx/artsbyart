import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Addproduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    brand: "",
    tags: "",
    color: "",
  });

  const [images, setImages] = useState([]);
  const [category, setCategory] = useState([]);
  const [color, setColor] = useState("");
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  useEffect(() => {
    const generateThumbnailUrls = async () => {
      const urls = await Promise.all(
        images.map(async (image) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            reader.readAsDataURL(image);
          });
        })
      );
      setThumbnailUrls(urls);
    };

    generateThumbnailUrls();
  }, [images]);

  useEffect(() => {
    // Fetch the colors when the component mounts
    const fetchColors = async () => {
      try {
        const response = await fetch("/api/products/color");
        if (!response.ok) {
          throw new Error("Failed to fetch colors");
        }
        const data = await response.json();
       
        // Set the colors in the state
        if (data.length > 0) {
          // Set the color state to the first color
          setColor(data[0].id);
        }
console.log(color);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    fetchColors();

    // Fetch the product categories when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        // Set the categories in the state
        setCategory(data); // Assuming you want to select the first category by default
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onDrop = (acceptedFiles) => {
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      images.forEach((image) => formDataToSend.append("images", image));

      const response = await axios.post(
        "/api/products/product",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product uploaded successfully:", response.data);

      setFormData({
        title: "",
        description: "",
        price: 0,
        brand: "",
        tags: "",
        
      });
      setColor([])
      setCategory([]);
      setImages([]);
      setThumbnailUrls([]);
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  return (
    <div className="w-full text-center font-opensans mt-12">
      <h2 className=" text-[30px] ">Upload Product Description</h2>

      <div className="mt-6">
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
        />
      </div>

      <div className="mt-6">
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
        />
      </div>

      <div className="mt-6">
        <input
          type="text"
          id="price"
          name="price"
          placeholder="price"
          value={formData.price}
          onChange={handleInputChange}
          className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
        />
      </div>

      <div className="mt-6">
        <select
          name="category"
          onChange={(e) => {
            const selectedCategoryId = e.target.value;
            const selectedCategory = category.find(
              (cat) => cat.id === selectedCategoryId
            );
            if (selectedCategory) {
              setCategory((prevCategory) => [
                ...prevCategory,
                selectedCategory,
              ]);
            }
          }}
          className="w-[800px] px-4 py-4 focus:outline-none border border-dark border-solid"
        >
          <option value="" disabled>
            Select Category
          </option>
          {category &&
            category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
        </select>
      </div>

      {/* <div className="mt-6">
        <select
          name="color"
          onChange={(e) => setColor(e.target.value)} 
          value={color}
          className="w-[800px] px-4 py-4 focus:outline-none border border-dark border-solid"
        >
          <option value="" disabled>
            Select Color
          </option>
          {color &&
            color.map((col) => (
              <option key={col.id} value={col.id}>
              {col.title} - {col.hex}
            </option>

            ))}
        </select>
      </div> */}

      {/* <div className="mt-6">
        <input
          type="text"
          id="brand"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleInputChange}
          className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
        />
      </div> */}

      {/* <div className="mt-6">
        <input
          type="text"
          id="tags"
          name="tags"
          placeholder="Tags"
          value={formData.tags}
          onChange={handleInputChange}
          className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
        />
      </div> */}

      <div {...getRootProps()} style={dropzoneStyle} className="mx-auto">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag & drop images here, or click to select files</p>
        )}

        {thumbnailUrls.length > 0 && (
          <div style={thumbnailsContainerStyle}>
            {thumbnailUrls.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`thumbnail-${index}`}
                style={thumbnailStyle}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div>
          <h4>Selected Images:</h4>
          <ul>
            {images.map((image, index) => (
              <li key={index}>{image.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="mt-[24px]  text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[0px] tracking-[1.5px] py-[18px] w-[800px]"
        onClick={handleUpload}
      >
        Upload Product
      </button>
    </div>
  );
};

const dropzoneStyle = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  marginTop: "20px",
  position: "relative",
  height: "20%",
  width: "50%",
};

const thumbnailsContainerStyle = {
  display: "flex",
  marginTop: "10px",
};

const thumbnailStyle = {
  width: "100px",
  height: "100px",
  marginRight: "10px",
};

export default Addproduct;
