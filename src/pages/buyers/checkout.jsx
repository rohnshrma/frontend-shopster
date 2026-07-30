import React, { useState , useEffect } from "react";
import BuyerHeader from "../../component/buyers/buyer-header";
import dummyimg from "../../assets/images/dummyproducts.webp";
import { Link } from "react-router-dom";
import { useBuyerProfileContext } from "../../context/buyerProfileContextCore";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/cartContextCore";
import API from "../../api/axios.js"




const Checkout = () => {

  const navigate = useNavigate();
  const {cartItems ,totalAmount} = useCartContext();
  const {buyerProfile, loading } = useBuyerProfileContext();
  const [formData, setFormData] = useState({
    username:"",
    phone:"",
    email:"",
    address:"",
    landmark:"",
    city:"",
    pincode:""
  });
   
  useEffect(()=>{
    if(buyerProfile){
    setFormData({
    username:`${buyerProfile?.username}`,
    phone:`${buyerProfile?.phone}`,
    email:`${buyerProfile?.email}`,
    address:`${buyerProfile?.address}`,
    landmark:"",
    city:"",
    pincode:""
      })
    }
  }, [buyerProfile])

  const formHandler = (e)=>{
    const {name , value} = e.target;
    setFormData((prevData)=>{return{...prevData , [name] : value}});
  }

  const submitHandler = async(e)=>{
    e.preventDefault();
    const {username , phone, email, address , city , pincode , landmark} = formData;
    if(!username || !phone || !email || !address || !city || !pincode){
      alert ("please filled all required fields");
      return;
    }
    const shippingAddress = ` ${address}, ${landmark}, ${city}, ${pincode}`;

    try{
    const response = await API("/order/place-order" , {
      method : "POST",
      tokenType:"buyer",
      body:JSON.stringify({
        shippingAddress,
        paymentMethod: "COD",
      })
    })
    console.log("Order placed", response)
   
    localStorage.setItem("lastOrder" ,  JSON.stringify(response.data))

    alert("order Placed successfully")
    localStorage.getItem("lastOrder")
    navigate("/order-success");

    }
    catch(err){
    console.log("placed order error" , err);
    alert (err.message , "failed to place order")
    }
  
  }


  return (
    <>
      <BuyerHeader />
      <section className="checkout_page">
        <div className="container py-5 ">
          {/* Heading */}
          <div className="mb-4">
            <h2 className="fw-bold">Checkout</h2>
            <p className="text-muted">
              Complete your order by providing delivery details.
            </p>
          </div>

          <div className="row g-4">
            {/* Left Section */}
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Delivery Details</h4>
                   <form>                   
                    <div className="checkoutinput">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        name="username"
                        value={formData.username}
                        onChange={formHandler}
                      />
                    </div>

                    <div className="checkoutinput">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="9876543210"
                        name="phone"
                        value={formData.phone}
                        onChange={formHandler}
                      />
                    </div>

                    <div className="checkoutinput">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="john@gmail.com"
                        name="email"
                        value={formData.email}
                        onChange={formHandler}
                      />
                    </div>

                    <div className="checkoutinput">
                      <label className="form-label">Address</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Enter Address"
                        name="address"
                        value={formData.address}
                        onChange={formHandler}
                      ></textarea>
                    </div>

                    <div className="checkoutinput">
                      <label className="form-label">Landmark (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Near Central Mall"
                        name="landmark"
                        value={formData.landmark}
                        onChange={formHandler}
                      />
                    </div>

                    <div className="row ">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Bengaluru"
                          name="city"
                          value={formData.city}
                          onChange={formHandler}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="560001"
                          name="pincode"
                          value={formData.pincode}
                          onChange={formHandler}
                        />
                      </div>
                    </div>
                  </form>
                 
                </div>
              </div>

              {/* COD Message */}

              <div className="alert alert-success mt-4 rounded-4">
                ✅ Cash on Delivery available
              </div>
            </div>

            {/* Right Section */}

            <div className="col-lg-5">
              {/* Order Summary */}

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Order Summary</h4>

                    <Link
                      to="/cart"
                      className="btn btn-link text-decoration-none p-0"
                    >
                      Edit Cart
                    </Link>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="d-flex align-items-center mb-3"
                    >
                      <img
                        src={dummyimg}
                        alt={item.name}
                        width="70"
                        height="70"
                        className="rounded border"
                      />

                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1">{item.name}</h6>

                        <small className="text-muted">
                          Qty : {item.quantity}
                        </small>
                      </div>

                      <strong>₹{item.price}</strong>
                    </div>
                  ))}

                  <hr />

                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>

                    <span>₹{totalAmount}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping</span>

                    <span>₹0</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fs-5 fw-bold">
                    <span>Total Amount</span>

                    <span className="text-danger">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment */}

              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-3">Payment Method</h4>

                  <div className="form-check border rounded-3 p-3 codbtn">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked
                      readOnly
                    />

                    <label className="form-check-label ms-2">
                      <strong>Cash on Delivery</strong>

                      <br />

                      <small className="text-muted">
                        Pay when your order is delivered.
                      </small>
                    </label>
                  </div>

                  <button type="submit" onClick={submitHandler}
                    className="btn w-100 text-white mt-4 py-3"
                    style={{
                      background: "#5B3DF5",
                    }}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
