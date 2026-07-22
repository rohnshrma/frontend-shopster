import { Link } from "react-router-dom";
import "../../App.css";
import dummyimg from "../../assets/images/dummyproducts.webp";
import { useCartContext } from "../../context/cartContextCore";

const CartItems = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    loading,
  } = useCartContext();

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cartitems">
        <p>Your cart is empty.</p>
        <div className="cartbtn_total">
          <Link to="/shop">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cartitems">
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            <div className="d-flex">
              <img src={dummyimg} alt={item.name} />
              <h4>{item.name}</h4>
            </div>

            <div className="d-flex">
              <p>₹ {item.price}</p>

              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() => decreaseQuantity(item._id)}
                >
                  -
                </button>

                <span className="qty-value">{item.quantity}</span>

                <button
                  className="qty-btn"
                  onClick={() => increaseQuantity(item._id)}
                >
                  +
                </button>
              </div>

              <span onClick={() => removeFromCart(item._id)}>
                <i className="fa-regular fa-trash-can"></i>
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="cartbtn_total">
        <Link to="/shop">Continue Shopping</Link>
        <button className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>
        <h4>
          Total Amount:<span>₹ {totalAmount}</span>
        </h4>
      </div>
      <p className="checkout-note">Checkout will be added in Phase 3</p>
    </div>
  );
};

export default CartItems;