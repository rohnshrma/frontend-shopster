import { useState, useEffect } from "react";
import Layout from "../component/layout";
import dummyimg from "../assets/images/dummyproducts.webp";
import API from "../api/axios";
import { useParams } from "react-router-dom";

const AdminOrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [refunding, setRefunding] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API(`/admin/orders/${id}`, {
          method: "GET",
          tokenType: "admin",
        });
        setOrder(response.data);
        setStatus(response.data.status);
        console.log("order details:", response.data);
      } catch (err) {
        console.log(err, "failed to fetch order details");
        alert(`${err}, failed to get order`);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // refund function /////////////////////////
  const handleRefund = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to refund ₹${order.totalAmount}?`,
    );

    if (!confirmed) return;

    try {
      setRefunding(true);

      // Backend refund API will be connected here
      // const response = await API(`/admin/orders/${id}/refund`, {
      //   method: "POST",
      //   tokenType: "admin",
      // });

      // setOrder(response.data);

      alert(
        "Refund UI is ready. Actual Stripe refund API will be connected next.",
      );
    } catch (err) {
      console.log(err, "failed to refund order");
      alert("Failed to process refund");
    } finally {
      setRefunding(false);
    }
  };

  const getBadge = (status) => {
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
  const updateStatus = async () => {
    try {
      const response = await API(`/admin/orders/${id}/status`, {
        method: "PUT",
        tokenType: "admin",
        body: JSON.stringify({
          status: status,
        }),
      });
      setOrder(response.data);
      setStatus(response.data.status);
      alert("Order status updated successfully");
    } catch (err) {
      console.log(err, "failed to update status");
      alert("failed to updated status");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading order details...</p>;
  }

  if (!order) {
    return <p className="text-center mt-5">Order not found.</p>;
  }

  return (
    <Layout>
      <section className="innercontent adminorderDetail">
        <div className="container-fluid py-4">
          {/* Heading */}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Order Details</h2>

            <span className={`badge bg-${getBadge(status)} px-4 py-2`}>
              {status}
            </span>
          </div>

          <div className="row">
            {/* Order Information */}

            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Order Information</h5>

                  <div className="row mb-3">
                    <div className="col-5 fw-semibold">Order ID</div>

                    <div className="col-7">{order._id}</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-5 fw-semibold">Order Date</div>

                    <div className="col-7">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-5 fw-semibold">Payment Method</div>

                    <div className="col-7">{order.paymentMethod}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-5 fw-semibold">Payment Status</div>

                    <div className="col-7">
                      <span
                        className={`badge ${
                          order.paymentStatus === "paid"
                            ? "bg-success"
                            : order.paymentStatus === "refunded"
                              ? "bg-secondary"
                              : "bg-warning text-dark"
                        }`}
                      >
                        {order.paymentStatus === "paid"
                          ? "Paid"
                          : order.paymentStatus === "refunded"
                            ? "Refunded"
                            : order.paymentStatus || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-5 fw-semibold">Total Amount</div>

                    <div className="col-7 fw-bold">₹{order.totalAmount}</div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-5 fw-semibold">Order Status</div>

                    <div className="col-7">
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    onClick={updateStatus}
                    disabled={status === order.status}
                  >
                    Update Status
                  </button>
                  {order.paymentMethod === "stripe" &&
                    order.paymentStatus === "paid" && (
                      <button
                        className="btn btn-outline-danger w-100 mt-3"
                        onClick={handleRefund}
                        disabled={refunding}
                      >
                        {refunding ? "Processing Refund..." : "Refund Payment"}
                      </button>
                    )}
                </div>
              </div>
            </div>

            {/* Buyer Information */}

            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Buyer Information</h5>

                  <h6>{order.buyer?.username}</h6>

                  <p className="mb-2">{order.buyer?.phone}</p>

                  <p className="mb-4">{order.buyer?.email}</p>

                  <p className="mb-1">{order.shippingAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items */}

          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Ordered Items</h5>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={dummyimg}
                              alt={item.name}
                              width="60"
                              height="60"
                              className="rounded border me-3"
                            />

                            <span className="fw-semibold">{item.name}</span>
                          </div>
                        </td>

                        <td>₹{item.price}</td>

                        <td>{item.quantity}</td>

                        <td className="text-end fw-semibold">
                          ₹{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold">Grand Total</h4>

                <h2 className="text-danger fw-bold">₹{order.totalAmount}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminOrderDetails;
