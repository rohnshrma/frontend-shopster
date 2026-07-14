import "../../App.css"
import buyerlogin from "../../assets/images/buyerlogin.webp";
import logo from "../../assets/images/logo.webp";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/axios";
import { useBuyerProfileContext } from "../../context/BuyerProfileContext";



const BuyerLogin = ()=>{
   const navigate = useNavigate();
   const { fetchBuyerProfile } = useBuyerProfileContext();

   const [buyerLogin , setBuyerLogin] = useState({
    email:"",
    password:""
   })
   const formHandler = (e)=>{
    const  { name , value} = e.target;
    setBuyerLogin((prevdata) =>{return {...prevdata , [name]:value}})
   }
   const SubmitHandler= async(e)=>{
    e.preventDefault();
   try{
   const response =  await API("/buyer/login", {
    method:"POST",
    body:JSON.stringify(buyerLogin)
    })
    localStorage.setItem("buyerToken" , response.token)
   alert("login successully");
   setBuyerLogin({
     email:"",
    password:""
   })
   await fetchBuyerProfile();

   navigate("/shop")
   } 
   catch(err){
    alert(err.message || "failed to login")
   }
  
   }
    return (
        <section className="Registerform">
             <div className="logo">
                    <img src={logo} alt="logo image" className="img-fluid"/>
                  </div>
                 <div className="container">
                     <div className="row">
                         <div className="col-lg-9 registerbox">
                         <div className="row">
                         <div className="col-md-6 p-0">
                             <img src={buyerlogin} alt="register img" className="img-fluid p-4" />
                         </div>
                         <div className="col-md-6 p-0">
                         <form onSubmit={SubmitHandler}>
                         <div className="formtitle text-center">
                             <h3>Welcome Back !</h3>
                             <p>Login to your account </p>
                         </div>
                        
                          <div className="form-group">
                             <label> Email Address</label>
                             <input type="email" name="email" placeholder="Enter your Email " value={buyerLogin.email} onChange={formHandler}  className="form-control" /> 
                         </div>
                          <div className="form-group">
                             <label>Password</label>
                             <input type="password" name="password" placeholder="Enter your Password" value={buyerLogin.password} onChange={formHandler}  className="form-control" /> 
                         </div>
                         
                         <div className="form_btn"><button type="submit">Login</button>
                         <p>Don't have an account? <Link to="/buyers/register">Register Now</Link> </p>
                         </div>
                         </form>
                         </div>
                     </div>
                         </div>
                     </div>
                   
                 </div>
             </section>
    )
}

export default BuyerLogin
