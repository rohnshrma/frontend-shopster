const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {

  return (
    <>
      <h4 className="fw-bold mb-3">Payment Method</h4>

      <div className="form-check border rounded-3 p-3 mb-3">
        <input
          className="form-check-input"
          type="radio"
          value="COD"
          checked={paymentMethod === "COD"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />

        <label className="form-check-label ms-2">
          <strong>Cash on Delivery</strong>
          <br />
          <small className="text-muted">
            Pay when your order is delivered.
          </small>
        </label>
      </div>

      <div className="form-check border rounded-3 p-3">
        <input
          className="form-check-input"
          type="radio"
          value="stripe"
          checked={paymentMethod === "stripe"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />

        <label className="form-check-label ms-2">
          <strong>Stripe</strong>
          <br />
          <small className="text-muted">
            Pay before your order is delivered.
          </small>
        </label>
      </div>
    </>
  );
};

export default PaymentMethodSelector;