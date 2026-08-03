
import React, {  useEffect, useState } from "react";
import BuyerHeader from "../../component/buyers/buyer-header";
import dummyimg from "../../assets/images/dummyproducts.webp";
import { Link } from "react-router-dom";
import API from "../../api/axios";




const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Confirmed":
      return "info";
    case "Shipped":
      return "primary";
    case "Delivered":
      return "success";
    case "Cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

const MyOrders = () => {
const [orders, setOrders ] = useState([])
const [loading , setLoading] = useState(true)

useEffect(()=>{
 const fetchOrders = async()=>{
  try{
 const response = await API("/order/order-history", {
  method:"GET",
  tokenType:"buyer"
 })
 console.log("Orders response:", response);
 setOrders(response.data);
  }
  catch(err){
  console.log("failed to fetch order" , err)
  }
  finally{
  setLoading(false);
  }
 }
 fetchOrders()
},[])

  return (
    <>
      <BuyerHeader />

      <section className="py-5 myorder">
        <div className="container">

          <div className="mb-5">
            <h2 className="fw-bold">My Orders</h2>
            <p className="text-muted">
              Track and manage your orders
            </p>
          </div>

          {orders.map((order) => (
            <div
              className="card border-0 shadow-sm rounded-4 mb-4"
              key={order._id}
            >
              <div className="card-body">

                <div className="row align-items-center">

                  {/* Image */}

                  <div className="col-lg-2 text-center">
                    <img
                      src={dummyimg}
                      alt=""
                      className="img-fluid rounded"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Order Info */}

                  <div className="col-lg-3">

                    <small className="text-muted">
                      Order ID
                    </small>

                    <h5 className="fw-bold text-primary">
                      {order._id}
                    </h5>

                  </div>

                  {/* Date */}

                  <div className="col-lg-2">

                    <h6>{new Date(order.createdAt).toLocaleDateString()}</h6>

                    <small className="text-muted">
                     {order.items.length} Items
                    </small>

                  </div>

                  {/* Total */}

                  <div className="col-lg-2">

                    <h4 className="fw-bold">
                      ₹{order.totalAmount}
                    </h4>

                  </div>

                  {/* Status */}

                  <div className="col-lg-1">

                    <span
                      className={`badge bg-${statusColor(order.status)}`} style={{fontSize:"1rem" }}
                    >
                      {order.status}
                    </span>

                  </div>

                  {/* Button */}

                  <div className="col-lg-2 text-end">

                    <Link
                      to={`/buyers/order-details/${order._id}`}
                      className="btn btn-outline-dark"
                    >
                      View Details
                    </Link>

                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>
      </section>
    </>
  );
};

export default MyOrders;