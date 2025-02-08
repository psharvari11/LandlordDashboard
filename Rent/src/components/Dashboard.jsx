import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MdOutlineDashboard } from 'react-icons/md';
import { FaTools, FaBuilding, FaMoneyBillWave } from 'react-icons/fa';
import logo from './black-bg.png';

const Dashboard = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="flex h-screen w-full bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-white shadow-md flex flex-col p-4 fixed h-screen">
      <img src={logo} alt="logo" className="w-32 mx-auto mb-6" />
      <nav className="space-y-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center p-2 rounded ${isActive ? "bg-green-200" : ""}`
          }
        >
          <MdOutlineDashboard className="mr-2" /> <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/property-management"
          className={({ isActive }) =>
            `flex items-center p-2 rounded ${isActive ? "bg-green-200" : ""}`
          }
        >
          <FaBuilding className="mr-2" /> <span>Property Management</span>
        </NavLink>

        <NavLink
          to="/maintenance-requests"
          className={({ isActive }) =>
            `flex items-center p-2 rounded ${isActive ? "bg-green-200" : ""}`
          }
        >
          <FaTools className="mr-2" /> <span>Maintenance & Communication</span>
        </NavLink>

        <NavLink
          to="/rent-payment"
          className={({ isActive }) =>
            `flex items-center p-2 rounded ${isActive ? "bg-green-200" : ""}`
          }
        >
          <FaMoneyBillWave className="mr-2" /> <span>Rent Payment</span>
        </NavLink>
      </nav>
    </aside>

    {/* Main Content */}
    <div className="flex flex-col flex-1 p-6 ml-64 overflow-auto">
      {/* Navbar */}
      <header className="flex justify-between items-center bg-white shadow p-4 rounded-lg">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search here"
          className="p-2 border rounded-md"
        />
      </header>

      {/* Page Content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  </div>
);
};

export default Dashboard;
