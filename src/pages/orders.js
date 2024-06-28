import React, { useEffect, useState } from 'react';
import { db } from '@/utils/appwrite';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPhoneFromLocalStorage, getPhoneFromLocalStorageLogin } from '@/utils/Localstorage';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const phoneNumber = getPhoneFromLocalStorage() || getPhoneFromLocalStorageLogin();
      if (!phoneNumber) {
        toast.error('Please insert your phone number to Register/Login.');
        return;
      }

      try {
        // Fetch completed tickets
        const completedResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID
        );
        const completedTickets = completedResponse.documents.filter(ticket => ticket.phoneNumber === phoneNumber);

        // Fetch open and in-progress tickets
        const ticketsResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID
        );
        const openAndInProgressTickets = ticketsResponse.documents.filter(ticket => {
            return ticket.phoneNumber === phoneNumber && ticket.status !== 'Completed';
          });
  
          // Filter out completed tickets from open and in-progress tickets
          const openAndInProgressFiltered = openAndInProgressTickets.filter(ticket => {
            return !completedTickets.find(completedTicket => completedTicket.$id === ticket.$id);
          });
  
          // Combine tickets into one list
          const tickets = [...openAndInProgressFiltered, ...completedTickets];

        // Fetch product details for each ticket
        const ordersWithDetails = await Promise.all(tickets.map(async (ticket) => {
          try {
            const productResponse = await fetch(`/api/products/product?name=${ticket.productName}`);
            const productData = await productResponse.json();
            const productKey = Object.keys(productData)[0];
            const product = productData[productKey] || {};

            const proceduresArray = product.procedures?.map(proc => {
              const existingProcedure = JSON.parse(ticket.procedures || '[]').find(p => p.description === proc);
              return { description: proc, completed: existingProcedure ? existingProcedure.completed : false };
            }) || [];
            const image = product.images?.[0] || null; // Fetch only the first image
            const status = completedTickets.find(t => t.$id === ticket.$id) ? 'Completed' : ticket.status;

            return { 
              ...ticket, 
              procedures: proceduresArray,
              image,
              progress: ticket.progress || 0,
              status
            };
          } catch (error) {
            console.error('Error fetching product details:', error);
            return { ...ticket, procedures: [], progress: ticket.progress || 0, status: ticket.status || 'Open' };
          }
        }));

        setOrders(ordersWithDetails);
      } catch (error) {
        toast.error(`Error fetching orders: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:mt-[14rem] mt-[6rem] mb-[6rem] px-4">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order.$id} className="border p-4 rounded shadow-md bg-white">
            {order.image ? (
              <img
                src={order.image}
                alt={order.productName}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded">
                <span>No Image Available</span>
              </div>
            )}
            <h2 className="text-xl font-semibold mt-2">{order.productName}</h2>
            <p className="text-gray-700 mt-1">Status: {order.status}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 relative">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${order.progress}%` }}
              ></div>
              <span className="absolute right-0 top-8 text-sm text-gray-800">{`${order.progress}% completed`}</span>
            </div>
            <p className="text-gray-700 mt-1">Procedures:</p>
            {order.procedures && order.procedures.length > 0 ? (
              <ul className="list-disc ml-5">
                {order.procedures.map((procedure, index) => (
                  <li key={index} className={procedure.completed ? "line-through" : ""}>
                    {procedure.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No procedures available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
