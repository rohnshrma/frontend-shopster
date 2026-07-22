import { createContext, useContext } from "react";

export const BuyerProfileContext = createContext();

export const useBuyerProfileContext = () => useContext(BuyerProfileContext);
