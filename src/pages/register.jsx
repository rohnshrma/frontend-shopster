import "../App.css"
import register_img from "../assets/images/registerimage.svg";

const Register = ()=>{
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
                    <form>
                    <div className="formtitle text-center">
                        <h3>Create Account</h3>
                        <p>Signup to get started</p>
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" placeholder="Enter your full name" className="form-control" /> 
                    </div>
                     <div className="form-group">
                        <label> Email Address</label>
                        <input type="email" name="email" placeholder="Enter your Email " className="form-control" /> 
                    </div>
                     <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Enter your Password" className="form-control" /> 
                    </div>
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="con-password" placeholder="Confirm your Password" className="form-control" /> 
                    </div>
                    <div className="form_btn"><button type="submit">Register</button>
                    <p>Already have an Account? <a href="/login">Login here</a> </p>
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