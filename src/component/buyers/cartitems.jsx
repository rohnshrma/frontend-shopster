import { Link } from "react-router-dom";
import "../../App.css";
import dummyimg from "../../assets/images/dummyproducts.webp";
import { useState } from "react";
import { useCartContext } from "../../context/CartContext";


const CartItems = () => {
  const {cartItems,increaseQuantity,decreaseQuantity,removeFromCart,totalAmount} = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  if(cartItems.length === 0){
    return(
      <p>No data found</p>
    )
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
          <button  className="qty-btn" onClick={() => decreaseQuantity(item._id)}>
            -
          </button>

          <span className="qty-value">{item.quantity}</span>

          <button  className="qty-btn" onClick={() => increaseQuantity(item._id)}>
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
        <h4>Total Amount:<span>₹ {totalAmount}</span></h4>
      </div>
    </div>
  );
};


export default CartItems;