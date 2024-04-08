"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function Procedures() {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      alert("Title and description are required.");
      return;
    }

    try {
      const res = await fetch("/api/products/procedures", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (res.ok) {
        // router.push("/");
        toast.success("Procedure created successfully");
      } else {
        throw new Error("Failed to create a topic");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mt-12 gap-3">
      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
      />

      <button
        type="submit"
        className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
      >
        Add Procedure
      </button>
    </form>
  );
}
