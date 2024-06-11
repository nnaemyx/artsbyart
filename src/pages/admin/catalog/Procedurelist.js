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

export default function ProcedureList() {
  const [topics, setTopics] = useState([]);
  const [editingTopic, setEditingTopic] = useState(null);
  const [newDescription, setNewDescription] = useState("");

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

  const handleEdit = (topic) => {
    setEditingTopic(topic._id);
    setNewDescription(topic.description);
  };

  const handleUpdate = async (procedureId) => {
    if (newDescription.trim() === "") {
      alert("Description cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/products/${procedureId}/procedures`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newProcedure: newDescription }),
      });

      if (response.ok) {
        const { updatedProcedure } = await response.json();
        setTopics((prevTopics) =>
          prevTopics.map((topic) =>
            topic._id === procedureId ? updatedProcedure : topic
          )
        );
        setEditingTopic(null);
        setNewDescription("");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update procedure");
      }
    } catch (error) {
      console.error("Error updating procedure:", error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
    setNewDescription("");
  };

  return (
    <>
      {topics.map((t) => (
        <div
          key={t._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            {editingTopic === t._id ? (
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border p-2"
              />
            ) : (
              <div>{t.description}</div>
            )}
          </div>

          <div className="flex gap-2">
            {editingTopic === t._id ? (
              <>
                <button
                  onClick={() => handleUpdate(t._id)}
                  className="text-green-600 hover:text-green-900"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-red-600 hover:text-red-900"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(t)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <RemoveBtn procedureId={t._id} onDelete={handleDelete} />
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
