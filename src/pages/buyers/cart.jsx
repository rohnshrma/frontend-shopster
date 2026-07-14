import "../../App.css";
import BuyerHeader from "../../component/buyers/buyer-header";
import CartItems from "../../component/buyers/cartitems";
import { useCartContext } from "../../context/CartContext";


const Cart = () => {
  const {cartItems} = useCartContext();
  const totalitems = cartItems.length;
  return (
    <>
      <BuyerHeader />
      <section className="cart">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="carttitle">
                <h3>Cart</h3>
                <p>{totalitems} items</p>
              </div>
              <CartItems />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
