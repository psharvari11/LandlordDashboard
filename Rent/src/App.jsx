import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Dashboardpage from "./pages/Dashboardpage";
import MyProperties from "./pages/PropertyManagement";
import MaintenanceCommunication from "./pages/Maintenance&Communication"
import RentPayment from "./pages/RentPayment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Dashboardpage />} />
          <Route path="property-management" element={<MyProperties />} />
          <Route path="maintenance-requests" element={<MaintenanceCommunication/>} />
          <Route path="rent-payment" element={<RentPayment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

