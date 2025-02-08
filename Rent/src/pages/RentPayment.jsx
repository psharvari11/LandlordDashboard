import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/rent_payments.json";

const RentPayment = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentData = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("Fetched rent data:", response.data); 
        
        if (response.data) {
          const tenantList = Object.keys(response.data).map((key) => {
            const tenantData = response.data[key];
            
            return {
              id: key,
              tenantName: tenantData.tenant_name || tenantData.tenant?.name || Object.keys(tenantData.tenants || {})[0] || "Unknown Tenant",
              ...tenantData,
            };
          });

          setTenants(tenantList);
        } else {
          setTenants([]);
        }
      } catch (error) {
        console.error("Error fetching rent data:", error);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRentData();
  }, []);

  const togglePaymentStatus = async (tenant) => {
    const newStatus = tenant.status === "Pending" ? "Paid" : "Pending";

    try {
      await axios.patch(
        `https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/rent_payments/${tenant.id}.json`,
        { status: newStatus }
      );

      setTenants((prev) =>
        prev.map((t) => (t.id === tenant.id ? { ...t, status: newStatus } : t))
      );
    } catch (error) {
      console.error("Error updating rent status:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Rent Payment Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : tenants.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">Tenant</th>
                <th className="p-4 text-left">Property</th>
                <th className="p-4 text-left">Rent Amount</th>
                <th className="p-4 text-left">Due Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-b">
                  <td className="p-4">{tenant.tenantName}</td>
                  <td className="p-4">{tenant.property}</td>
                  <td className="p-4">₹{tenant.rent_amount}</td>
                  <td className="p-4">{tenant.due_date}</td>
                  <td className={`p-4 font-semibold ${tenant.status === "Pending" ? "text-red-500" : "text-green-500"}`}>
                    {tenant.status}
                  </td>
                  <td className="p-4 flex justify-center space-x-2">
                    <button
                      className={`px-4 py-2 rounded text-white cursor-pointer ${
                        tenant.status === "Pending" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                      onClick={() => togglePaymentStatus(tenant)}
                    >
                      {tenant.status === "Pending" ? "Mark as Paid" : "Mark as Pending"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No rent data available.</p>
      )}
    </div>
  );
};

export default RentPayment;
