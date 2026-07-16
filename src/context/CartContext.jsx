import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Normalize backend cart data into the flat format the UI expects
  // Backend returns: { items: [{ product: { _id, name, price, ... }, quantity }] }
  // UI expects:      [{ _id, name, price, quantity }]
  const normalizeCart = (cartData) => {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      return [];
    }
    return cartData.items.map((item) => ({
      _id: item.product._id || item.product,
      name: item.product.name || "",
      price: item.product.price || 0,
      category: item.product.category || "",
      image: item.product.image || "",
      quantity: item.quantity,
    }));
  };

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("buyerToken");
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await API("/cart", { method: "GET" });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      console.log("Failed to fetch cart:", err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart on mount if buyer is logged in
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add Product to cart via backend API
  const addToCart = async (product) => {
    try {
      setLoading(true);
      const response = await API("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
          quantity: product.quantity || 1,
        }),
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      console.log("Failed to add to cart:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Increase Quantity
  const increaseQuantity = async (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (!item) return;

    try {
      const response = await API(`/cart/${id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      console.log("Failed to update quantity:", err.message);
    }
  };

  // Decrease Quantity
  const decreaseQuantity = async (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (!item || item.quantity <= 1) return;

    try {
      const response = await API(`/cart/${id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      console.log("Failed to update quantity:", err.message);
    }
  };

  // Remove Item from cart
  const removeFromCart = async (id) => {
    try {
      const response = await API(`/cart/${id}`, {
        method: "DELETE",
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      console.log("Failed to remove item:", err.message);
    }
  };

  // Total Amount (computed from current state)
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
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);