import { useState } from "react";
import "../App.css"
import register_img from "../assets/images/registerimage.svg";
import {useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";
import API from "../api/axios";

const Register = ()=>{
    const navigate = useNavigate();
    const [registerData , setRegisterData] = useState({
        name:"",
        email:"",
        password:""
    })
    const formHandler=(e)=>{
        const {name , value} = e.target;
        setRegisterData((prevData)=>{return{...prevData , [name] : value}});
    }
    const SubmitRegister = async (e)=>{
        e.preventDefault();
        try {
          await API("/auth/register", {
            method: "POST",
            body: JSON.stringify({
              username: registerData.name,
              email: registerData.email,
              password: registerData.password,
            }),
          });
        } catch (error) {
            alert(error.message || "register failed")
            return;
        }
        alert("register successfully");
        setRegisterData({
            name:"",
            email:"",
            password:""
        })
        navigate("/login")

    }
    return (
        <section className="Registerform">
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 registerbox">
                    <div className="row">
                    <div className="col-md-6 p-0">
                        <img src={register_img} alt="register img" className="img-fluid"/>
                    </div>
                    <div className="col-md-6 p-0">
                    <form onSubmit={SubmitRegister}>
                    <div className="formtitle text-center">
                        <h3>Create Account</h3>
                        <p>Signup to get started</p>
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" placeholder="Enter your full name" value={registerData.name} className="form-control" onChange={formHandler}/> 
                    </div>
                     <div className="form-group">
                        <label> Email Address</label>
                        <input type="email" name="email" placeholder="Enter your Email " value={registerData.email} className="form-control" onChange={formHandler}/> 
                    </div>
                     <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Enter your Password" value={registerData.password} className="form-control" onChange={formHandler}/> 
                    </div>
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="con-password" placeholder="Confirm your Password" className="form-control" /> 
                    </div>
                    <div className="form_btn"><button type="submit">Register</button>
                    <p>Already have an Account? <Link to="/login">Login here</Link> </p>
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

export default Register;
