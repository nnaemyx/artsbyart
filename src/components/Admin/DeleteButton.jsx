import { HiOutlineTrash } from "react-icons/hi";

export default function RemoveBtn({ procedureId, onDelete }) {
  const removeProcedure = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      try {
        const res = await fetch(`/api/products/${procedureId}/procedures`, {
          method: "DELETE",
        });

        if (res.ok) {
          // If deletion is successful, call the onDelete callback to update the UI
          onDelete(procedureId);
        } else {
          console.error("Failed to delete procedure");
        }
      } catch (error) {
        console.error("Error deleting procedure: ", error);
      }
    }
  };

  return (
    <button onClick={removeProcedure} className="text-red-400">
      <HiOutlineTrash size={24} />
    </button>
  );
}
