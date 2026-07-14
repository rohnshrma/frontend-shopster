import { Navigate } from "react-router-dom";


const BuyerProtectedRoute = ({children})=>{
   const token = localStorage.getItem("buyerToken");
   if(!token){
    return <Navigate to="/buyers/login" />
   }
   return children;
}
export default BuyerProtectedRoute;