import { createContext , useState , useContext, useEffect } from "react";

export const ProductContext = createContext();

export const ProductContextProvider = ({children})=>{
    const [productData , setProduct] = useState([]);
    useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProduct(data);
    }, []);
    // const ProductHandler = (proData) =>{
    //    return setProduct((prevdata) => {return [...prevdata , proData]})
    // };
    const ProductHandler = (proData) => {
    setProduct((prevData) => {
    const updatedData = [...prevData, proData];

    localStorage.setItem(
      "products",
      JSON.stringify(updatedData)
    );
    return updatedData;
     });
  };
    // const DeleteHandler = (deletindex) =>{
    //     return setProduct(productData.filter((data , i)=> i !=deletindex))
    // };
    const DeleteHandler = (id) => {
  setProduct((prevData) => {
    const updatedData = prevData.filter(
      (item) => item.id !== id
    );

    localStorage.setItem(
      "products",
      JSON.stringify(updatedData)
    );

    return updatedData;
  });
};
    return <ProductContext.Provider value={{productData , ProductHandler , DeleteHandler}}>{children}</ProductContext.Provider>
}

export const useProductContext = ()=>{return useContext(ProductContext)};