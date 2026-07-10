import { useCallback, useState, useEffect } from "react";
import API from "../api/axios";
import { ProductContext } from "./productContextCore";

export const ProductContextProvider = ({children})=>{
    const [productData , setProduct] = useState([]);
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState("");

    const normalizeProduct = (product) => ({
      ...product,
      id: product._id || product.id,
    });

    const FetchProducts = useCallback(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API("/product");
        setProduct((response.data || []).map(normalizeProduct));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      FetchProducts();
    }, [FetchProducts]);

    const ProductHandler = async (proData) => {
      const response = await API("/product", {
        method: "POST",
        body: JSON.stringify(proData),
      });
      const newProduct = normalizeProduct(response.data);
      setProduct((prevData) => [...prevData, newProduct]);
      return newProduct;
  };

  const UpdatedHandler = async (updateItem)=>{
    const response = await API(`/product/${updateItem.id}`, {
      method: "PUT",
      body: JSON.stringify(updateItem),
    });
    const updatedProduct = normalizeProduct(response.data);
    setProduct((prevData)=> prevData.map((item)=>item.id === updatedProduct.id ? updatedProduct : item));
    return updatedProduct;
  }
  
    const DeleteHandler = async (id) => {
      await API(`/product/${id}`, {
        method: "DELETE",
      });
      setProduct((prevData) => prevData.filter((item) => item.id !== id));
};

    return <ProductContext.Provider value={{productData , loading , error , FetchProducts , ProductHandler , DeleteHandler, UpdatedHandler}}>{children}</ProductContext.Provider>
}
