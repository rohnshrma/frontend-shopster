import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ProductContextProvider } from "./context/productcontext.jsx";
import { BuyerProfileProvider } from "./context/BuyerProfileContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductContextProvider>
      <CartProvider>
        <BuyerProfileProvider>
          <App />
        </BuyerProfileProvider>
      </CartProvider>
    </ProductContextProvider>
  </StrictMode>,
);
