import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AllProducts from "./pages/productlisting";
import ProductDetails from "./pages/peoductdetails";
import AddProduct from "./pages/addproduct";
import UpdateProduct from "./pages/updateproduct";
import ProtectedRoute from "./route/protectedRoute";
import BuyerLogin from "./pages/buyers/login";
import BuyerRegister from "./pages/buyers/register";
import Shop from "./pages/buyers/shop";
import BuyerProductDetails from "./pages/buyers/product-details";
import Cart from "./pages/buyers/cart";
import BuyerProfile from "./pages/buyers/buyerprofile";
import EditProfile from "./pages/buyers/editprofile";
import BuyerProtectedRoute from "./route/buyerprotectedroute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AllProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productsdetails/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addproduct"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateproduct/:id"
          element={
            <ProtectedRoute>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        {/* Buyer Routes */}
        <Route path="/buyers/login" element={<BuyerLogin />} />
        <Route path="/buyers/register" element={<BuyerRegister />} />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/shop/productdetails/:id"
          element={<BuyerProductDetails />}
        />
        <Route
          path="/cart"
          element={
            <BuyerProtectedRoute>
              <Cart />
            </BuyerProtectedRoute>
          }
        />
        <Route
          path="/buyers/profile"
          element={
            <BuyerProtectedRoute>
              <BuyerProfile />
            </BuyerProtectedRoute>
          }
        />
        <Route
          path="/buyers/profile/edit"
          element={
            <BuyerProtectedRoute>
              <EditProfile />
            </BuyerProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
