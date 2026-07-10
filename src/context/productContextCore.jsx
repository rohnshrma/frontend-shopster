import { createContext, useContext } from "react";

export const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);
