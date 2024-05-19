import useColorStore from "@/store/color/colorStore";
import useProductCategoryStore from "@/store/pcategory/pStore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import useProcedureStore from "@/store/procedures/procedureStore";

const Addproduct = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [procedures, setProcedures] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [images, setImages] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const colorStore = useColorStore(); // Get the color store
  const categoryStore = useProductCategoryStore(); // Get the product category store
  const procedureStore = useProcedureStore();

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

  const onDropImages = (acceptedFiles) => {
    setImages([...images, ...acceptedFiles]);
  };

  const onDropVideo = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedVideo = acceptedFiles[0];
      setVideo(selectedVideo);
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoUrl(event.target.result);
      };
      reader.readAsDataURL(selectedVideo);
    }
  };

  const {
    getRootProps: getRootPropsImages,
    getInputProps: getInputPropsImages,
    isDragActive: isDragActiveImages,
  } = useDropzone({
    onDrop: onDropImages,
    accept: "image/*",
    multiple: true,
  });

  const {
    getRootProps: getRootPropsVideo,
    getInputProps: getInputPropsVideo,
    isDragActive: isDragActiveVideo,
  } = useDropzone({
    onDrop: onDropVideo,
    accept: "video/*",
    multiple: false,
  });

  useEffect(() => {
    // Fetch the colors when the component mounts
    colorStore.getColors();
    // Fetch the product categories when the component mounts
    categoryStore.getCategories();
    procedureStore.getProcedures();
  }, []);

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("procedures", procedures);
    if (video) {
      formData.append("video", video);
    }
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // Send a POST request to your API route with FormData
      const res = await fetch("/api/products/product", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Product uploaded successfully, navigate to the image upload page
        toast.success("Product uploaded successfully");
      } else {
        // Handle errors
        console.error("Error uploading product:", res.statusText);
      }
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  return (
    <div className="w-full text-center font-opensans mt-12">
      <h2 className="mt-6 text-[30px] ">Upload Product Description</h2>
      <form onSubmit={handleFormSubmit} className="pt-6">
        <div>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
          />
        </div>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
          />
        </div>
        <div className="mt-6">
          <input
            type="text"
            id="price"
            name="price"
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
          />
        </div>
        <div className="mt-6">
          <textarea
            placeholder="Product Description"
            value={description}
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-[800px] px-4 py-4 focus:outline-none  border border-dark border-solid"
          />
        </div>

        <div className="mt-6">
          <select
            name="category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-[800px] px-4 py-4 focus:outline-none border border-dark border-solid"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoryStore.pCategories.map((productCategory) => (
              <option key={productCategory.id} value={productCategory.title}>
                {productCategory.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <select
            name="procedures"
            onChange={(e) => {
              const selectedProcedureOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setProcedures(selectedProcedureOptions);
            }}
            value={procedures}
            className="w-[800px] px-4 py-4 focus:outline-none border border-dark border-solid"
            multiple // Enable multiple selection
          >
            <option value="" disabled>
              Select Procedures
            </option>
            {procedureStore.procedures.map((procedure) => (
              <option key={procedure.id} value={procedure.description}>
                {procedure.description}
              </option>
            ))}
          </select>
        </div>

        <div {...getRootPropsImages()} style={dropzoneStyle} className="mx-auto">
          <input {...getInputPropsImages()} />
          {isDragActiveImages ? (
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

        <div {...getRootPropsVideo()} style={dropzoneStyle} className="mx-auto">
          <input {...getInputPropsVideo()} />
          {isDragActiveVideo ? (
            <p>Drop the video here ...</p>
          ) : (
            <p>Drag & drop a video here, or click to select a file</p>
          )}
        </div>

        {video && (
          <div>
            <h4>Selected Video:</h4>
            <p>{video.name}</p>
            {videoUrl && (
              <video controls style={videoPreviewStyle}>
                <source src={videoUrl} type={video.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}

        <button
          type="submit"
          className="mt-[24px]  text-[12px] md:text-[14px] font-semibold bg-dark text-white px-[0px] tracking-[1.5px] py-[18px] w-[800px]"
        >
          Upload Product
        </button>
      </form>
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

const videoPreviewStyle = {
  marginTop: "10px",
  width: "100%",
  maxWidth: "600px",
  height: "auto",
};

export default Addproduct;
