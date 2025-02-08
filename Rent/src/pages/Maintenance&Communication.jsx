import React, { useEffect, useState } from "react";
import axios from "axios";

const REQUESTS_API = "https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/maintenance_requests.json";
const MESSAGES_API = "https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/messages.json";

const MaintenanceCommunication = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(REQUESTS_API);
        if (response.data) {
          const requestList = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));
          setRequests(requestList);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.patch(
        `https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/maintenance_requests/${id}.json`,
        { status }
      );
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  // 🔹 Fetch Messages for a Selected Tenant
  const fetchMessages = async (tenantName) => {
    try {
      const response = await axios.get(MESSAGES_API);
      if (response.data && response.data[tenantName]) {
        setMessages(response.data[tenantName]);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  // 🔹 Handle Tenant Selection
  const handleSelectTenant = (tenantName) => {
    setSelectedTenant(tenantName);
    fetchMessages(tenantName);
  };

  // 🔹 Send a New Message
  const handleSendMessage = async () => {
    if (!selectedTenant || !newMessage.trim()) return;

    const newMsg = {
      sender: "Landlord",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(
        `https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/messages/${selectedTenant}.json`,
        newMsg
      );
      setMessages([...messages, newMsg]); // Update UI
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Maintenance & Communication</h1>

      {/* Maintenance Requests Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Maintenance Requests</h2>
          {loading ? (
            <p>Loading...</p>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="border p-3 mb-3 rounded">
                <p><strong>Tenant:</strong> {request.tenant_name}</p>
                <p><strong>Property:</strong> {request.property}</p>
                <p><strong>Issue:</strong> {request.description}</p>
                <p className={`font-semibold ${request.status === "Pending" ? "text-red-500" : "text-green-500"}`}>
                  Status: {request.status}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                    onClick={() => updateRequestStatus(request.id, "Resolved")}
                  >
                    Mark as Resolved
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded cursor-pointer hover:bg-yellow-600"
                    onClick={() => updateRequestStatus(request.id, "In Progress")}
                  >
                    In Progress
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No maintenance requests available.</p>
          )}
        </div>

        {/* Communication Section */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Tenant Communication</h2>
          <select
            className="p-2 border rounded w-full mb-4 cursor-pointer"
            onChange={(e) => handleSelectTenant(e.target.value)}
          >
            <option value="">Select Tenant</option>
            {requests.map((request) => (
              <option key={request.id} value={request.tenant_name}>{request.tenant_name}</option>
            ))}
          </select>
          <div className="border p-4 h-60 overflow-auto rounded mb-4 bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`p-2 mb-2 rounded ${msg.sender === "Landlord" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}>
                  <p><strong>{msg.sender}:</strong> {msg.message}</p>
                </div>
              ))
            ) : (
              <p>No messages.</p>
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="p-2 border rounded w-full"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2 cursor-pointer hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCommunication;
