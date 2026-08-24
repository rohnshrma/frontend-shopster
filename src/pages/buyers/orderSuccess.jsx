import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import BuyerHeader from "../../component/buyers/buyer-header";
import API from "../../api/axios";
import jsPDF from "jspdf";

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

  const downloadInvoice = () => {
    if (!order) return;

    if (order.paymentStatus !== "paid") {
      alert("Invoice can be downloaded only after payment is successful.");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SHOPSTER", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("E-Commerce Invoice", 20, 32);

    // Invoice title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 20, 25, {
      align: "right",
    });

    // Order information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Order ID: ${order._id}`, 20, 50);

    doc.text(
      `Order Date: ${
        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"
      }`,
      20,
      57,
    );

    doc.text(`Payment Method: ${order.paymentMethod || "-"}`, 20, 64);

    doc.text(
      `Payment Status: ${
        order.paymentStatus === "paid" ? "Paid" : order.paymentStatus
      }`,
      20,
      71,
    );

    // Shipping address
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address", 20, 88);

    doc.setFont("helvetica", "normal");

    const shippingAddress = order.shippingAddress || "-";

    const addressLines = doc.splitTextToSize(shippingAddress, 170);

    doc.text(addressLines, 20, 95);

    // Items heading
    let y = 115;

    doc.setFont("helvetica", "bold");
    doc.text("Items", 20, y);

    doc.text("Qty", 125, y);
    doc.text("Price", 150, y);
    doc.text("Total", 180, y);

    y += 8;

    doc.setFont("helvetica", "normal");

    order.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;

      const itemName = doc.splitTextToSize(item.name, 95);

      doc.text(itemName, 20, y);

      doc.text(String(item.quantity), 125, y);

      doc.text(`₹${item.price}`, 150, y);

      doc.text(`₹${itemTotal}`, 180, y);

      y += Math.max(8, itemName.length * 5);
    });

    // Total
    y += 10;

    doc.setFont("helvetica", "bold");

    doc.line(20, y - 5, 190, y - 5);

    doc.setFontSize(13);

    doc.text(`Grand Total: ₹${order.totalAmount}`, 190, y + 5, {
      align: "right",
    });

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text("Thank you for shopping with Shopster!", pageWidth / 2, 280, {
      align: "center",
    });

    doc.save(`Shopster-Invoice-${order._id}.pdf`);
  };

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

  const isPaid = order.paymentStatus === "paid";

  return (
    <>
      <BuyerHeader />

      <section className="order-success py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* SUCCESS HEADER */}
              <div className="text-center mb-5">
                <BsCheckCircleFill size={90} className="text-success mb-3" />

                <h2 className="fw-bold">Order Placed Successfully!</h2>

                <p className="text-muted">
                  Thank you for your order. We have received your order and will
                  process it soon.
                </p>
              </div>

              {/* ORDER SUMMARY */}
              <div className="card shadow-sm border-0 rounded-4 mb-5">
                <div className="card-body p-4">
                  <div className="row text-center text-md-start">
                    <div className="col-md-3 mb-3">
                      <small className="text-muted d-block">Order ID</small>

                      <h6 className="fw-bold text-primary">{order._id}</h6>
                    </div>

                    <div className="col-md-3 mb-3">
                      <small className="text-muted d-block">Order Date</small>

                      <h6 className="fw-semibold">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : ""}
                      </h6>
                    </div>

                    <div className="col-md-3 mb-3">
                      <small className="text-muted d-block">Total Amount</small>

                      <h6 className="fw-semibold">₹{order.totalAmount}</h6>
                    </div>

                    <div className="col-md-3 mb-3">
                      <small className="text-muted d-block">
                        Payment Method
                      </small>

                      <h6 className="fw-semibold text-uppercase">
                        {order.paymentMethod}
                      </h6>
                    </div>

                    {/* PAYMENT STATUS */}
                    <div className="col-md-3 mb-3">
                      <small className="text-muted d-block">
                        Payment Status
                      </small>

                      <h6
                        className={`fw-semibold ${
                          isPaid ? "text-success" : "text-warning"
                        }`}
                      >
                        {isPaid ? "Paid" : order.paymentStatus || "Pending"}
                      </h6>
                    </div>

                    {/* ORDER STATUS */}
                    <div className="col-md-3 mb-3">
                      <small className="text-muted d-block">Order Status</small>

                      <h6 className="fw-semibold">{order.status}</h6>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDERED ITEMS */}
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

              {/* INVOICE */}
              {isPaid && (
                <div className="card shadow-sm border-0 rounded-4 mb-5">
                  <div className="card-body p-4 text-center">
                    <h5 className="fw-bold">Payment Successful</h5>

                    <p className="text-muted mb-4">
                      Your payment has been successfully received. You can
                      download your invoice.
                    </p>

                    <button
                      onClick={downloadInvoice}
                      className="btn btn-success px-5 py-2"
                    >
                      Download Invoice
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
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
