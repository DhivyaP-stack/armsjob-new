import React, { useState } from "react";
import { Pagination } from "../../common/Pagination";

export const CanditebenchlistTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("IT");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const candidateData = [
    { name: "Ashish", technology: "Java", experience: "9+", availability: "Immediate", location: "Dubai" },
    { name: "Vinee", technology: "Python Developer", experience: "10+", availability: "Immediate", location: "Sarjah" },
    { name: "Mukul", technology: "Data Engineering", experience: "8+", availability: "Immediate", location: "Sarjah" },
    { name: "Ashish", technology: "Java", experience: "9+", availability: "Immediate", location: "Dubai" },
    { name: "Vinee", technology: "Python Developer", experience: "7+", availability: "Immediate", location: "Dubai" },
    { name: "Mukul", technology: "Data Engineering", experience: "4+", availability: "Immediate", location: "Dubai" },
    { name: "Ashish", technology: "Java", experience: "3+", availability: "Immediate", location: "Sarjah" },
    { name: "Vinee", technology: "Python Developer", experience: "9+", availability: "Immediate", location: "Sarjah" },
    { name: "Mukul", technology: "Data Engineering", experience: "11+", availability: "Immediate", location: "Dubai" },

  ];

   const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page when items per page changes
    };

  return (
    <div className="p-6 space-y-10">
      {/* Dropdown */}
      <div className="w-[200px]">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-400 rounded px-4 py-2 w-full"
        >
          <option value="IT">IT</option>
          <option value="Engineers&Technicians">Engineers & Technicians</option>
          <option value="Electricians">Electricians</option>
          <option value="Plumbers">Plumbers</option>
          <option value="Welders&Fabricators">Welders & Fabricators</option>
        </select>
      </div>

      {/* Description Text */}
      <p className="text-gray-600">
        Sodales adipiscing semper litora cras ut vulputate eu viverra erat volutpat. Placerat vestibulum luctus neque lacus class aptent tellus lorem phasellus suspendisse urna.
      </p>

      {/* Candidate Table */}
      <div className="overflow-x-auto">
        <>
          <table className="w-200 text-sm">
            <thead className=" text-left">
              <tr className="text-black">
                <th className="border-b py-4"><input type="checkbox" /></th>
                <th className="border-b py-4 font-bold  ">Name</th>
                <th className="border-b py-4 font-bold ">Technology</th>
                <th className="border-b py-4 font-bold ">Experience</th>
                <th className="border-b py-4 font-bold ">Availability</th>
                <th className="border-b py-4 font-bold ">Location</th>
              </tr>
            </thead>
            <tbody>
              {candidateData.map((item, index) => (
                <tr key={index} className="border-tborder-b py-3-gray-200 hover:bg-gray-50">
                  <td className="border-b py-4 font-medium"><input type="checkbox" /></td>
                  <td className="border-b py-4 font-medium">{item.name}</td>
                  <td className="border-b py-4 font-medium">{item.technology}</td>
                  <td className="border-b py-4 font-medium">{item.experience}</td>
                  <td className="border-b py-4 font-medium">{item.availability}</td>
                  <td className="border-b py-4 font-medium">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      </div>
    </div>
  );
};
