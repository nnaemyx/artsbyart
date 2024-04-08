import RemoveBtn from "@/components/Admin/DeleteButton";
import { useEffect, useState } from "react";

async function getTopics() {
  try {
    const res = await fetch("/api/products/procedures", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading topics: ", error);
    return []; // Return an empty array in case of error
  }
}

export default function Procedurelist() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const topicsData = await getTopics();
      setTopics(topicsData);
    };

    fetchTopics();
  }, []);

  const handleDelete = async (id) => {
    // Remove the deleted topic from the state
    setTopics((prevTopics) => prevTopics.filter((topic) => topic._id !== id));
  };

  return (
    <>
      {topics.map((t) => (
        <div
          key={t._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <div>{t.description}</div>
          </div>

          <div className="flex gap-2">
            {/* Pass the handleDelete callback to RemoveBtn */}
            <RemoveBtn id={t._id} onDelete={handleDelete} />
          </div>
        </div>
      ))}
    </>
  );
}
