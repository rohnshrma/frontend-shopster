import React from "react";
import {Routes , Route, BrowserRouter} from "react-router-dom"
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AllProducts from "./pages/productlisting";
import ProductDetails from "./pages/peoductdetails"; 
import AddProduct from "./pages/addproduct";
import UpdateProduct from "./pages/updateproduct";


const App = ()=>{
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element ={<Login />} />
      <Route path="/register" element ={<Register />} />
      <Route path="/" element ={<Dashboard />} />
      <Route path="/products" element ={<AllProducts />} />
      <Route path="/productsdetails/:id" element ={<ProductDetails />} />
      <Route path="/addproduct" element = {<AddProduct />} />
      <Route path="/updateproduct" element={<UpdateProduct />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;