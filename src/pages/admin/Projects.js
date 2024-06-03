import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '@/utils/appwrite';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch completed tickets
        const ticketsResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID
        );
        const tickets = ticketsResponse.documents;

        // Fetch all IC details
        const icsResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
        );
        const ics = icsResponse.documents;
        // Fetch product images and match IC names for each ticket
        const projectsWithDetails = await Promise.all(tickets.map(async (ticket) => {
          try {
            // Fetch product data
            const productResponse = await fetch(`/api/products/product?name=${ticket.productName}`);
            const productData = await productResponse.json();
            const productKey = Object.keys(productData)[0];
            const productImages = productData[productKey]?.images || [];
            const productImage = productImages[0] || null;

            // Match IC names
            const assignedICs = ticket.assignedICs;
            const icDetails = ics.find(ic => ic.$id === assignedICs);
            const icName = icDetails ? icDetails.bus_name : 'Unknown IC';
            console.log(ics)

            return { ...ticket, productImage, icName };
          } catch (error) {
            console.error('Error fetching project details:', error);
            return { ...ticket, productImage: null, icName: 'Unknown IC' };
          }
        }));

        setProjects(projectsWithDetails);
      } catch (error) {
        toast.error(`Error fetching projects: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleChat = (assignedICs) => {
    router.push('/admin/chat/Chat');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.$id} className="border p-4 rounded shadow-md bg-white">
            <img
              src={project.productImage}
              alt={project.productName}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{project.productName}</h2>
            <p className="text-gray-700 mt-1">Assigned to: {project.icName}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <button
              onClick={() => handleChat(project.assignedICs)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Chat with IC
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
