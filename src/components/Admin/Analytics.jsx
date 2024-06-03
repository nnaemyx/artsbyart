import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { db } from '@/utils/appwrite';
import 'chart.js/auto'; // necessary for Chart.js 3.x

const Analytics = () => {
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch completed orders count
        const ordersResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID
        );
        const orders = ordersResponse.documents || [];
        setCompletedOrdersCount(orders.length);

        // Set up chart data
        const data = {
          labels: ['Completed Orders'],
          datasets: [
            {
              label: 'Orders',
              data: [orders.length],
              backgroundColor: ['#FF6384'],
              hoverBackgroundColor: ['#FF6384'],
            },
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className=" mt-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Completed Orders Statistics</h3>
          {chartData.datasets.length > 0 && <Bar data={chartData} />}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Order Completion</h3>
          {chartData.datasets.length > 0 && <Doughnut data={chartData} />}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Summary</h3>
        <p>Number of Completed Orders: {completedOrdersCount}</p>
      </div>
    </div>
  );
};

export default Analytics;
