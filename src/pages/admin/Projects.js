import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '@/utils/appwrite';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [ics, setIcs] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjectsAndICs = async () => {
      try {
        // Fetch completed tickets
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID
        );
        const tickets = response.documents;

        // Fetch IC details
        const icResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
        );
        const icData = icResponse.documents.reduce((acc, ic) => {
          acc[ic.$id] = ic.bus_name; 
          return acc;
        }, {});

        setIcs(icData);

        // Fetch product images and progress for each ticket
        const projectsWithDetails = await Promise.all(tickets.map(async (ticket) => {
          try {
            const productResponse = await fetch(`/api/products/product?name=${ticket.productName}`);
            const productData = await productResponse.json();
            const productKey = Object.keys(productData)[0];
            const productImages = productData[productKey]?.images || [];
            const progress = ticket.progress || 0; // Fetch the progress

            return { 
              ...ticket, 
              productImage: productImages[0] || null,
              progress
            };
          } catch (error) {
            console.error('Error fetching product details:', error);
            return ticket;
          }
        }));

        setProjects(projectsWithDetails);
      } catch (error) {
        toast.error(`Error fetching projects or ICs: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndICs();
  }, []);

  const handleChat = (icId) => {
    router.push('/admin/chat/Chat'); // Adjust the route as per your chat page setup
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.$id} className="border p-4 rounded shadow-md bg-white">
            {project.productImage ? (
              <img
                src={project.productImage}
                alt={project.productName}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded">
                <span>No Image Available</span>
              </div>
            )}
            <h2 className="text-xl font-semibold mt-2">{project.productName}</h2>
            <p className="text-gray-700 mt-1">Assigned to: {ics[project.assignedICs] || 'Unknown IC'}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 relative">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
              <span className="absolute right-0 top-8 text-sm text-gray-800">{`${project.progress}% completed`}</span>
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
