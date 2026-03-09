"use client";

import React, { useState } from "react";
import Dashboard from "./Dashboard";
import InvoiceDetail from "./InvoiceDetail";
import Header from "./header";
import SideBar from "./sideBar";

type View = "dashboard" | "detail";

const CustomerFlow: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const handleViewDetail = () => {
    setCurrentView("detail");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <SideBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Content */}
        <div className="flex-1">
          {currentView === "dashboard" && <Dashboard onViewDetail={handleViewDetail} />}
          {currentView === "detail" && <InvoiceDetail onBack={handleBackToDashboard} />}
        </div>
      </div>
    </div>
  );
};

export default CustomerFlow;
