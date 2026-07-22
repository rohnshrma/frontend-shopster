import { useEffect, useState } from "react";
import API from "../api/axios";
import { BuyerProfileContext } from "./buyerProfileContextCore";

export const BuyerProfileProvider = ({ children }) => {
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBuyerProfile = async () => {
    try {
      setError("");
      const response = await API("/buyer/profile", {
        method: "GET",
        tokenType: "buyer",
      });
      setBuyerProfile(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("buyerToken");
    if (token) {
      fetchBuyerProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const UpdatedHandler = async (updateItem) => {
    try {
      setError("");
      const response = await API("/buyer/profile", {
        method: "PUT",
        body: JSON.stringify(updateItem),
        tokenType: "buyer",
      });
      setBuyerProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const DeleteHandler = async () => {
    try {
      setError("");
      await API("/buyer/profile", {
        method: "DELETE",
        tokenType: "buyer",
      });
      localStorage.removeItem("buyerToken");
      setBuyerProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <BuyerProfileContext.Provider
      value={{
        buyerProfile,
        setBuyerProfile,
        loading,
        error,
        fetchBuyerProfile,
        UpdatedHandler,
        DeleteHandler,
      }}
    >
      {children}
    </BuyerProfileContext.Provider>
  );
};