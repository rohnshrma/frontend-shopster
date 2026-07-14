import { createContext, useContext, useState } from "react";
import dummyimg from "../assets/images/dummyproducts.webp";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add Product
 const addToCart = (product) => {
  const existingItem = cartItems.find(
    (item) => item._id === product._id
  );

  if (existingItem) {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + product.quantity,
            }
          : item
      )
    );
  } else {
    setCartItems((prev) => [...prev, product]);
  }
};

  // Increase Quantity
  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease Quantity
  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove Item
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  // Total Amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);