import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/Api";
import { BsFillPencilFill } from "react-icons/bs";
import { BsArchive } from "react-icons/bs";


const Product = () => {
  const [products, setProducts] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(""); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [formData, setFormData] = useState({
    product_name: "",
    cost_price: "",
    selling_price: "",
    quantity: "",
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products/");
      setProducts(response.data.records || []);
    } catch (error) {
      toast.error("Failed to fetch products.");
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product_name") {
      const selectedProduct = products.find((p) => p.product_name === value);
      if (selectedProduct) {
        setFormData({
          product_name: selectedProduct.product_name,
          cost_price: selectedProduct.cost_price,
          selling_price: selectedProduct.selling_price,
          quantity: selectedProduct.quantity,
        });
        setSelectedProduct(selectedProduct);
      } else {
        setFormData({ ...formData, product_name: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/products/", formData);
      toast.success("Product added successfully!");
      fetchProducts();
      closeForm();
    } catch (error) {
      const errorMessage =
        error.response?.data?.product_name?.[0] || "Failed to add product.";
      toast.error(errorMessage);
    }
  };

  // Update an existing product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/products/${selectedProduct.id}/`, formData);
      toast.success("Product updated successfully!");
      fetchProducts();
      closeForm();
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}/`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  // Open Add form
  const openAddForm = () => {
    setFormType("add");
    setFormData({ product_name: "", cost_price: "", selling_price: "", quantity: "" });
    setSelectedProduct(null);
    setShowForm(true);
  };

  // Open Update form
  const openUpdateForm = (product) => {
    setFormType("update");
    setFormData({
      product_name: product.product_name,
      cost_price: product.cost_price,
      selling_price: product.selling_price,
      quantity: product.quantity,
    });
    setSelectedProduct(product);
    setShowForm(true);
  };

  // Close the form
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
            {/* <button
              onClick={openAddForm}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Add
            </button> */}
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">PRODUCT</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">QUANTITY</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">COST-PRICE</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">SELLING-PRICE</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">TOTAL</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">DATE</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-4">{product.product_name}</td>
                      <td className="py-3 px-4">{product.quantity}</td>
                      <td className="py-3 px-4">K {product.cost_price}</td>
                      <td className="py-3 px-4">K {product.selling_price}</td>

                      <td className="py-3 px-4">K {product.total_cost}</td> 
                      <td className="py-3 px-4">{product.formatted_date}</td> 
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openUpdateForm(product)}
                          className="bg-blue-500 hover:bg-green-600 text-white font-semibold py-1 px-3 m-2 rounded"
                        >
                          <BsFillPencilFill />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                        >
                          <BsArchive />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3 px-4">
                      No products found.
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
                  {formType === "add" ? "Add New Product" : "Update Product"}
                </h2>
                <form onSubmit={formType === "add" ? handleAddProduct : handleUpdateProduct}>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Product</label>
                    <select
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.product_name}>
                          {product.product_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Cost Price</label>
                    <input
                      type="number"
                      name="cost_price"
                      value={formData.cost_price}
                      onChange={handleChange}
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Selling Price</label>
                    <input
                      type="number"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleChange}
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      Save
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

export default Product;
