import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

export const BuyerProfileContext = createContext();

export const BuyerProfileProvider = ({ children }) => {
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch Buyer Profile
  const fetchBuyerProfile = async () => {
    try {
      const response = await API("/buyer/profile", {
        method: "GET",
      });

      setBuyerProfile(response.data);
    } catch (err) {
      console.log(err);
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

  // Update Buyer Profile
  const UpdatedHandler = async (updateItem) => {
    try {
      const response = await API(`/buyer/profile/${updateItem._id}`, {
        method: "PUT",
        body: JSON.stringify(updateItem),
      });

      setBuyerProfile(response.data);

      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const DeleteHandler = async (id) => {
  try {
    await API(`/buyer/profile/${id}`, {
      method: "DELETE",
    });

    localStorage.removeItem("buyerToken");
    setBuyerProfile(null);

  } catch (err) {
    console.log(err);
  }
};


  return (
    <BuyerProfileContext.Provider
      value={{
        buyerProfile,
        setBuyerProfile,
        loading,
        fetchBuyerProfile,
        UpdatedHandler,
        DeleteHandler
      }}
    >
      {children}
    </BuyerProfileContext.Provider>
  );
};

export const useBuyerProfileContext = () => {
  return useContext(BuyerProfileContext);
};