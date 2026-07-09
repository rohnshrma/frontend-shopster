import { useState } from "react";
import "../App.css"
import login_img from "../assets/images/loginimage.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = ()=>{
    const navigate = useNavigate();
    const [loginData , setLoginData] = useState({
        email:"",
        password:""
    })
    const formHandler = (e)=>{
        const{name  , value} = e.target;
        setLoginData((prevData)=>{return {...prevData , [name]:value}})
    }
    const SubmitLogin = (e)=>{
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("users")) || [];
        if(user && user.find((item)=>item.email === loginData.email && item.password === loginData.password)){
           localStorage.setItem("token" , "temp_token");
            alert ("login successfully");
            setLoginData({
                email:"",
                password:""
            })
            navigate("/");
        }
         else{
         alert("login failed")
         }
    
    }
    return (
        <section className="Registerform">
                 <div className="container">
                     <div className="row">
                         <div className="col-lg-9 registerbox">
                         <div className="row">
                         <div className="col-md-6 p-0">
                             <img src={login_img} alt="register img" className="img-fluid" p-4/>
                         </div>
                         <div className="col-md-6 p-0">
                         <form onSubmit={SubmitLogin}>
                         <div className="formtitle text-center">
                             <h3>Welcome Back !</h3>
                             <p>Signin to your account </p>
                         </div>
                        
                          <div className="form-group">
                             <label> Email Address</label>
                             <input type="email" name="email" placeholder="Enter your Email " value={loginData.email} onChange={formHandler} className="form-control" /> 
                         </div>
                          <div className="form-group">
                             <label>Password</label>
                             <input type="password" name="password" placeholder="Enter your Password"  value={loginData.password} onChange={formHandler} className="form-control" /> 
                         </div>
                         
                         <div className="form_btn"><button type="submit">Login</button>
                         <p>Don't have an account? <Link to="/register">Register Now</Link> </p>
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

export default Login