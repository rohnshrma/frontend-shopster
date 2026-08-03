import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import BuyerHeader from "../../component/buyers/buyer-header";
import API from "../../api/axios";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API(`/order/order-history/${id}`, {
          method: "GET",
          tokenType: "buyer",
        });
        setOrder(response.data);
      } catch (err) {
        console.log("failed to fetch order", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <>
        <BuyerHeader />
        <p className="text-center mt-5">Loading order...</p>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <BuyerHeader />
        <p className="text-center mt-5">Order not found.</p>
      </>
    );
  }

  return (
    <>
    <BuyerHeader />
      <section className="order-success py-5">
      <div className="container">

        <div className="row justify-content-center">
          <div className="col-lg-8">

            <div className="text-center mb-5">

              <BsCheckCircleFill
                size={90}
                className="text-success mb-3"
              />

              <h2 className="fw-bold">
                Order Placed Successfully!
              </h2>

              <p className="text-muted">
                Thank you for your order. We have received your
                order and will process it soon.
              </p>

            </div>

            <div className="card shadow-sm border-0 rounded-4 mb-5">
              <div className="card-body p-4">

                <div className="row text-center text-md-start">

                  <div className="col-md-3 mb-3">
                    <small className="text-muted d-block">
                      Order ID
                    </small>

                    <h6 className="fw-bold text-primary">
                      {order._id}
                    </h6>
                  </div>

                  <div className="col-md-3 mb-3">
                    <small className="text-muted d-block">
                      Order Date
                    </small>

                    <h6 className="fw-semibold">
                    {order.createdAt
  ? new Date(order.createdAt).toLocaleDateString()
  : ""}
                    </h6>
                  </div>

                  <div className="col-md-3 mb-3">
                    <small className="text-muted d-block">
                      Total Amount
                    </small>

                    <h6 className="fw-semibold">
                     ₹{order.totalAmount}
                    </h6>
                  </div>

                  <div className="col-md-3 mb-3">
                    <small className="text-muted d-block">
                      Payment Method
                    </small>

                    <h6 className="fw-semibold">
                      {order.paymentMethod}
                    </h6>
                  </div>

                </div>

              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 mb-5">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Ordered Items</h5>
                  <span className="badge bg-warning text-dark px-3 py-2">
                    {order.status}
                  </span>
                </div>

                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <small className="text-muted">
                        Qty : {item.quantity}
                      </small>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 flex-wrap">

              <Link
                to="/buyers/orders"
                className="btn btn-outline-secondary px-5 py-2"
              >
                View My Orders
              </Link>

              <Link
                to="/shop"
                className="btn text-white px-5 py-2"
                style={{
                  background: "#5B3DF5",
                }}
              >
                Continue Shopping
              </Link>

            </div>

          </div>
        </div>

      </div>
    </section>
    </>

  );
};

export default OrderSuccess;
