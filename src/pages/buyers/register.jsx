import "../../App.css";
import buyerregister from "../../assets/images/buyerregister.webp";
import logo from "../../assets/images/logo.webp";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const BuyerRegister = () => {
  const navigate = useNavigate();
  const [buyerRegister, setBuyerRegister] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (buyerRegister.username === "") {
      newErrors.username = "Full Name is required";
    }

    // Email
    if (buyerRegister.email === "") {
      newErrors.email = "Email is required";
    } else if (!buyerRegister.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    // Password
    if (buyerRegister.password === "") {
      newErrors.password = "Password is required";
    } else if (buyerRegister.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Phone
    if (buyerRegister.phone === "") {
      newErrors.phone = "Phone number is required";
    } else if (buyerRegister.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    // Address
    if (buyerRegister.address === "") {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    return true;
  };
  const formHandler = (e) => {
    const { name, value } = e.target;
    setBuyerRegister((prevData) => {
      return { ...prevData, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await API("/buyer/register", {
        method: "POST",
        body: JSON.stringify(buyerRegister),
        tokenType: "buyer",
      });
    } catch (err) {
      alert(err.message || "failed to register");
      return;
    }
    alert("register successfully");
    setBuyerRegister({
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    });
    setErrors({});
    navigate("/buyers/login");
  };
  return (
    <section className="Registerform buyerregister">
      <div className="logo">
        <img src={logo} alt="logo image" className="img-fluid" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-9 registerbox">
            <div className="row">
              <div className="col-md-6 p-0">
                <img
                  src={buyerregister}
                  alt="register img"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-6 p-0">
                <form onSubmit={SubmitHandler}>
                  <div className="formtitle text-center">
                    <h3>Create Account</h3>
                    <p>Join shopster and start shopping</p>
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your full name"
                      className="form-control"
                      onChange={formHandler}
                      value={buyerRegister.username}
                    />
                    {errors.username && (
                      <small className="text-danger">{errors.username}</small>
                    )}
                  </div>
                  <div className="form-group">
                    <label> Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your Email "
                      className="form-control"
                      onChange={formHandler}
                      value={buyerRegister.email}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your Password"
                      className="form-control"
                      onChange={formHandler}
                      value={buyerRegister.password}
                    />
                    {errors.password && (
                      <small className="text-danger">{errors.password}</small>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="number"
                      name="phone"
                      placeholder="phone number"
                      className="form-control"
                      onChange={formHandler}
                      value={buyerRegister.phone}
                    />
                    {errors.phone && (
                      <small className="text-danger">{errors.phone}</small>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      className="form-control"
                      onChange={formHandler}
                      value={buyerRegister.address}
                    />
                    {errors.address && (
                      <small className="text-danger">{errors.address}</small>
                    )}
                  </div>
                  <div className="form_btn">
                    <button type="submit">Register</button>
                    <p>
                      Already have an Account?
                      <Link to="/buyers/login"> Login here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyerRegister;
