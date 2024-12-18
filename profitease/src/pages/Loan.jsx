import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loan = () => {
  // State to handle form visibility
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(""); // 'add' or 'update'
  const [selectedProduct, setSelectedProduct] = useState(null); // Holds selected product da ta for updating

  // Function to open Add form
  const openAddForm = () => {
    setFormType("add");
    setSelectedProduct(null);
    setShowForm(true);
  };

  // Function to open Update form with data
  const openUpdateForm = (product) => {
    setFormType("update");
    setSelectedProduct(product);
    setShowForm(true);
  };

  // Function to confirm and delete an item
  const confirmDelete = (productName) => {
    toast.warn(`Are you sure you want to delete ${productName}?`, {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Function to close the form
  const closeForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <ToastContainer />
      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "65px" }}>
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={openAddForm}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Add
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">PRODUCT</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">QUANTITY</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">Total_Amount</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">Date</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample Rows */}
                {[
                  { product: "SOAP", quantity: 30, Total_Amount: "K 3500000.00", Date: 14-12-2024 },
                  { product: "SUGAR", quantity: 40, Total_Amount: "K 45000000.00", Date: 14-12-2024 },
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{row.product}</td>
                    <td className="py-3 px-4">{row.quantity}</td>
                    <td className="py-3 px-4">{row.Total_Amount}</td>
                    <td className="py-3 px-4">{row.Date}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openUpdateForm(row)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 m-2 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => confirmDelete(row.product)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Popup Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <h2 className="text-2xl font-semibold mb-4">
                  {formType === "add" ? "Add New Product" : "Update Product"}
                </h2>
                <form>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Product Name</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedProduct?.product || ""}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Cost Price</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedProduct?.cost || ""}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Selling Price</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedProduct?.price || ""}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Quantity</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedProduct?.quantity || ""}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      {formType === "add" ? "Save" : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Loan;
