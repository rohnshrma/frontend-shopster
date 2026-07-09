import React from "react";
import {Routes , Route, BrowserRouter} from "react-router-dom"
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AllProducts from "./pages/productlisting";
import ProductDetails from "./pages/peoductdetails"; 
import AddProduct from "./pages/addproduct";
import UpdateProduct from "./pages/updateproduct";
import ProtectedRoute from "./route/protectedRoute";


const App = ()=>{
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element ={<Login />} />
      <Route path="/register" element ={<Register />} />
      <Route path="/" element ={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
       } />
      <Route path="/products" element ={
         <ProtectedRoute>
          <AllProducts />
         </ProtectedRoute>
        } />
      <Route path="/productsdetails/:id" element ={
        <ProtectedRoute>
        <ProductDetails />
        </ProtectedRoute>
        } />
      <Route path="/addproduct" element = {
        <ProtectedRoute>
         <AddProduct />
        </ProtectedRoute>
        } />
      <Route path="/updateproduct/:id" element={
        <ProtectedRoute>
        <UpdateProduct />
        </ProtectedRoute>
       } />
    </Routes>
    </BrowserRouter>
  )
}

export default App;