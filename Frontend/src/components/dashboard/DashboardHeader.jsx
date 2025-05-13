import React from "react";

const DashboardHeader = ({ title }) => {
  return (
    <header className="bg-gradient-to-r from-[#fdfbfb] to-[#ebedee] shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6 sm:px-8 lg:px-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text tracking-wide font-[Inter]">
          {title}
        </h1>      
      </div>
    </header>
  );
};

export default DashboardHeader;

