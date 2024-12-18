import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/Api";
import { BsFillPencilFill } from "react-icons/bs";
import { BsArchive } from "react-icons/bs";

const Sales = () => {
  const [sales, setSales] = useState([]); // Holds sales data
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(""); // 'add' or 'update'
  const [selectedSale, setSelectedSale] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    quantity_sold: "",
    date_sold: "",
  });

  const API_URL = "/api/sales/";

  // Function to load sales data (Read)
  const loadSales = async () => {
    try {
      const response = await api.get(API_URL);
      console.log(response)
      setSales(response.data.records || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to load sales data.");
    }
  };

  useEffect(() => {
    loadSales(); 
  }, []);

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to open Add form
  const openAddForm = () => {
    setFormType("add");
    setFormData({ product: "", quantity_sold: "", date_sold: "" });
    setShowForm(true);
  };

  // Function to open Update form
  const openUpdateForm = (sale) => {
    setFormType("update");
    setSelectedSale(sale);
    setFormData({
      product: sale.product,
      quantity_sold: sale.quantity_sold,
      date_sold: sale.date_sold,
    });
    setShowForm(true);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formType === "add") {
        // Create Operation
        await api.post(API_URL, formData);
        toast.success("Sale added successfully!");
      } else {
        // Update Operation
        await api.put(`${API_URL}${selectedSale.id}/`, formData);
        toast.success("Sale updated successfully!");
      }
      loadSales(); 
      closeForm();
    } catch (error) {
      console.error("Error saving sale:", error);
      toast.error("Failed to save sale.");
    }
  };

  // Function to confirm and delete a sale
  const confirmDelete = async (sale) => {
    if (window.confirm(`Are you sure you want to delete ${sale.product}?`)) {
      try {
        await axios.delete(`${API_URL}${sale.id}/`);
        toast.success("Sale deleted successfully!");
        loadSales();
      } catch (error) {
        console.error("Error deleting sale:", error);
        toast.error("Failed to delete sale.");
      }
    }
  };

  // Function to close the form
  const closeForm = () => {
    setShowForm(false);
    setSelectedSale(null);
  };

  return (
    <>
      <ToastContainer />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "65px" }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={openAddForm}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Add Sale
            </button>
          </div>

          {/* Sales Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">Product</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">Quantity Sold</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">Date Sold</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
  {sales.length > 0 ? (
    sales.map((row, index) => (
      <tr key={index} className="border-b hover:bg-gray-100">
        <td className="py-3 px-4">{row.product}</td>
        <td className="py-3 px-4">{row.quantity}</td>
        <td className="py-3 px-4">{row.total_amount}</td>
        <td className="py-3 px-4">{row.date}</td>
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
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center py-4">
        No sales data available.
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <h2 className="text-2xl font-semibold mb-4">
                  {formType === "add" ? "Add Sale" : "Update Sale"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1">Product</label>
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg py-2 px-3"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Quantity Sold</label>
                    <input
                      type="number"
                      name="quantity_sold"
                      value={formData.quantity_sold}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg py-2 px-3"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Date Sold</label>
                    <input
                      type="date"
                      name="date_sold"
                      value={formData.date_sold}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg py-2 px-3"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={closeForm} className="bg-gray-300 px-4 py-2 rounded mr-2">
                      Cancel
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
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

export default Sales;
