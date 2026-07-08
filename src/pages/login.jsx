import "../App.css"
import login_img from "../assets/images/loginimage.svg";


const Login = ()=>{
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
                         <form>
                         <div className="formtitle text-center">
                             <h3>Welcome Back !</h3>
                             <p>Signin to your account </p>
                         </div>
                        
                          <div className="form-group">
                             <label> Email Address</label>
                             <input type="email" name="email" placeholder="Enter your Email " className="form-control" /> 
                         </div>
                          <div className="form-group">
                             <label>Password</label>
                             <input type="password" name="password" placeholder="Enter your Password" className="form-control" /> 
                         </div>
                         
                         <div className="form_btn"><button type="submit">Login</button>
                         <p>Don't have an account? <a href="/register">Register Now</a> </p>
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