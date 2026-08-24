import { useState, useEffect } from "react";
import BuyerHeader from "../../component/buyers/buyer-header";
import dummyimg from "../../assets/images/dummyproducts.webp";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await API(`/order/order-history/${id}`, {
          method: "GET",
          tokenType: "buyer",
        });
        console.log("order details:", response);
        setOrder(response.data);
      } catch (err) {
        console.log("failed to fetch daata", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-5">Loading order details...</p>;
  }

  if (!order) {
    return <p className="text-center mt-5">Order not found.</p>;
  }
  return (
    <>
      <BuyerHeader />

      <section className="py-5 myorder">
        <div className="container">
          {/* Heading */}

          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold">Order Details</h2>
              <p className="text-muted mb-0">Order ID : {order._id}</p>
            </div>

            <span className="badge bg-warning text-dark px-4 py-2">
              {order.status}
            </span>
          </div>

          <div className="row">
            {/* Left */}

            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 pt-3 pb-0 pe-4 ps-3">
                <div className="card-body">
                  <h5 className="fw-bold mb-4">Order Items</h5>

                  {order.items.map((item) => (
                    <div
                      className="d-flex align-items-center mb-5 "
                      key={item._id}
                    >
                      <img
                        src={dummyimg}
                        alt={item.name}
                        width="80"
                        height="80"
                        className="rounded border"
                      />

                      <div className="ms-3 flex-grow-1">
                        <h5>{item.name}</h5>

                        <small className="text-muted">
                          Qty : {item.quantity}
                        </small>
                      </div>

                      <h5 className="fw-bold">₹{item.price}</h5>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}

            <div className="col-lg-5">
              {/* Summary */}

              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-4">Order Summary</h5>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping</span>
                    <strong>₹0</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <h5>Total Amount</h5>
                    <h4 className="text-danger">₹{order.totalAmount}</h4>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-4">Shipping Address</h5>
                  <p>{order.shippingAddress}</p>
                  {/* 
                  <h6>{order.shippingAddress.name}</h6>

                  <p><b>{order.shippingAddress.phone}</b></p>

                  <p className="mb-1">
                    {order.shippingAddress.address}
                  </p>

                  <p className="mb-1">
                    {order.shippingAddress.city},
                    {" "}
                    {order.shippingAddress.state}
                    {" - "}
                    {order.shippingAddress.pincode}
                  </p>

                  <p>
                    {order.shippingAddress.landmark}
                  </p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}

          <div className="card border-0 shadow-sm rounded-4 mt-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order Information</h5>

              <div className="row">
                {/* Left */}

                <div className="col-md-6">
                  <div className="mb-4">
                    <small className="text-muted d-block">Order Date</small>

                    <h6 className="fw-semibold">
                      {new Date(order.createdAt).toLocaleString()}
                    </h6>
                  </div>

                  <div>
                    <small className="text-muted d-block">Payment Method</small>

                    <h6 className="fw-semibold"> {order.paymentMethod}</h6>
                  </div>
                </div>

                {/* Right */}

                <div className="col-md-6">
                  <div className="mb-4">
                    <small className="text-muted d-block">Order Status</small>

                    <span className="badge bg-warning text-dark px-3 py-2">
                      {order.status}
                    </span>
                  </div>

                  <div>
                    <small className="text-muted d-block">
                      Expected Delivery
                    </small>

                    <h6 className="fw-semibold">28 May 2024 - 31 May 2024</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}

          <div className="mt-4">
            <button
              className="btn btn-outline-secondary px-4"
              onClick={() => window.history.back()}
            >
              ← Back to My Orders
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;
