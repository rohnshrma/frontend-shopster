import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { CartContext } from "./cartContextCore";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("buyerToken");
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await API("/cart", { method: "GET", tokenType: "buyer" });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      setError(err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    try {
      setLoading(true);
      setError("");
      const response = await API("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
          quantity: product.quantity || 1,
        }),
        tokenType: "buyer",
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (id) => {
    const existingItem = cartItems.find((cartItem) => cartItem._id === id);
    if (!existingItem) return;

    try {
      setError("");
      const response = await API(`/cart/${id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: existingItem.quantity + 1 }),
        tokenType: "buyer",
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      setError(err.message);
    }
  };

  const decreaseQuantity = async (id) => {
    const existingItem = cartItems.find((cartItem) => cartItem._id === id);
    if (!existingItem || existingItem.quantity <= 1) return;

    try {
      setError("");
      const response = await API(`/cart/${id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: existingItem.quantity - 1 }),
        tokenType: "buyer",
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFromCart = async (id) => {
    try {
      setError("");
      const response = await API(`/cart/${id}`, {
        method: "DELETE",
        tokenType: "buyer",
      });
      const normalized = normalizeCart(response.data);
      setCartItems(normalized);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError("");
      await API("/cart", {
        method: "DELETE",
        tokenType: "buyer",
      });
      setCartItems([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        clearCart,
        totalAmount,
        loading,
        error,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};