import { Route, Routes } from "react-router-dom";
import BuyerLogin from "../pages/buyers/login";
import BuyerRegister from "../pages/buyers/register";
import Shop from "../pages/buyers/shop";
import BuyerProductDetails from "../pages/buyers/product-details";
import Cart from "../pages/buyers/cart";
import BuyerProfile from "../pages/buyers/buyerprofile";
import EditProfile from "../pages/buyers/editprofile";
import BuyerProtectedRoute from "./buyerprotectedroute";

const BuyerRoute = () => {
  return (
    <Routes>
      <Route path="/buyers/login" element={<BuyerLogin />} />
      <Route path="/buyers/register" element={<BuyerRegister />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/productdetails/:id" element={<BuyerProductDetails />} />
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
        path="/buyers/profile/edit/"
        element={
          <BuyerProtectedRoute>
            <EditProfile />
          </BuyerProtectedRoute>
        }
      />
    </Routes>
  );
};

export default BuyerRoute;
