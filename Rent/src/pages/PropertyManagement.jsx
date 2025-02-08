import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/properties.json";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    rent: "",
    status: "Occupied",
    image: "",
    description: "",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data) {
          const propertyList = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));
          setProperties(propertyList);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleManage = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setSelectedProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedProperty || !selectedProperty.id) return;

    try {
      await axios.patch(
        `https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/properties/${selectedProperty.id}.json`,
        selectedProperty
      );

      setProperties((prev) =>
        prev.map((prop) => (prop.id === selectedProperty.id ? selectedProperty : prop))
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  
  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://rent-bc133-default-rtdb.asia-southeast1.firebasedatabase.app/Landlorddb/properties.json",
        newProperty
      );
      if (response.data) {
        setProperties([...properties, { id: response.data.name, ...newProperty }]);
        setShowAddForm(false);
        setNewProperty({
          name: "",
          address: "",
          rent: "",
          status: "Occupied",
          image: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Properties</h1>

     
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add Property"}
      </button>

     
      {showAddForm && (
        <form onSubmit={handleAddProperty} className="bg-white p-6 rounded shadow mb-6">
          <input
            type="text"
            placeholder="Property Name"
            className="w-full p-2 border rounded mb-2"
            value={newProperty.name}
            onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border rounded mb-2"
            value={newProperty.address}
            onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Rent"
            className="w-full p-2 border rounded mb-2"
            value={newProperty.rent}
            onChange={(e) => setNewProperty({ ...newProperty, rent: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-2 border rounded mb-2"
            value={newProperty.image}
            onChange={(e) => setNewProperty({ ...newProperty, image: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded mb-2"
            value={newProperty.description}
            onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
            Submit
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="p-4 border rounded-lg shadow-md">
              {property.image ? (
                <img src={property.image} alt={property.name} className="w-full h-48 object-cover rounded-md" />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-md">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              <h2 className="text-lg font-semibold mt-2">{property.name}</h2>
              <p>{property.address}</p>
              <p>Rent: ₹{property.rent}</p>
              <p>Status: {property.status}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full cursor-pointer hover:bg-blue-600"
                onClick={() => handleManage(property)}
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties available.</p>
      )}

      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Manage Property</h2>
            <input
              type="text"
              name="name"
              value={selectedProperty.name}
              onChange={handleUpdate}
              className="w-full border p-2 mb-2"
              placeholder="Property Name"
            />
            <input
              type="text"
              name="rent"
              value={selectedProperty.rent}
              onChange={handleUpdate}
              className="w-full border p-2 mb-2"
              placeholder="Rent Amount"
            />
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600" onClick={handleClose}>
                Close
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
