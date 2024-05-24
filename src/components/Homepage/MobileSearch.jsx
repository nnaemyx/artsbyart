import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCustomContext } from "@/context/Customcontext"; // Adjust the import path accordingly

const MobileSearch = () => {
  const { products, categories, closeBottom } = useCustomContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const combinedData = [
        ...products.map((product) => ({
          ...product,
          type: "product",
        })),
        ...categories.map((category) => ({
          ...category,
          type: "category",
        })),
      ];

      const results = combinedData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, products, categories]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gray-800 bg-opacity-75 z-20">
      <div className="bg-white p-6 h-full shadow-lg overflow-auto">
        <button onClick={closeBottom} className="text-black mb-4">
          Close
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for products or categories"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="mt-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div
                key={index}
                className="p-4 mb-4 border border-gray-200 rounded shadow-sm"
              >
                {result.type === "product" ? (
                  <Link href={`/products/${result.slug}`}>
                    <div className="flex items-center gap-4">
                      <img
                        src={result.images ? result.images[0] : ""}
                        alt={result.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{result.title}</h3>
                        {result.price && (
                          <p className="text-sm text-gray-600">
                            Price: N{result.price}
                          </p>
                        )}
                        {result.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {result.description}
                          </p>
                        )}
                        {result.category && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              Category: {result.category}
                            </h4>
                            <div className="flex gap-2 overflow-x-auto">
                              {categories.find((cat) => cat.title === result.category)?.images?.map((image, idx) => (
                                <img
                                  key={idx}
                                  src={image}
                                  alt={result.category}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/collection/${result.title}`}>
                
                      <h3 className="text-lg font-semibold">{result.title}</h3>
                      <div className="flex gap-2 overflow-x-auto">
                        {result.images?.map((image, idx) => (
                          <img
                            key={idx}
                            src={image}
                            alt={result.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div>No results found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSearch;
