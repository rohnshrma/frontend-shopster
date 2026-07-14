import "../../App.css";
import dummypro from "../../assets/images/dummyproducts.webp";
import { Link } from "react-router-dom";
import BuyerHeader from "../../component/buyers/buyer-header";
import Footer from "../../component/buyers/footer";
import { useState } from "react";
import { useProductContext } from "../../context/productContextCore";
import { useParams } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";


const BuyerProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const {productData} = useProductContext();
  const {id} = useParams();
  const product = productData.find((items)=>items._id ===id ) 

  const handleAddToCart = () => {
  addToCart({
    ...product,
    quantity,
  });
 navigate("/cart")
};

  return (
    <>
      <BuyerHeader />
      <section className="productdetails">
        <div className="container">
          <div className="row ">
            <div className="col-lg-5">
              <img
                src={dummypro}
                alt="product image"
                className="img-fluid w-100"
              />
            </div>
            <div className="col-lg-5 col-md-7">
              <div className="proinfo">
                <h3>{product?.name}</h3>
                <ul>
                  <li>
                    <b>Category:</b> <p>{product?.category}</p>
                  </li>
                  <li>
                    <b>Price:</b> <p>₹ {product?.price}</p>
                  </li>
                </ul>
                <div class="quantity-box">
                  <label>Quantity</label>

                 <div className="quantity-control">
                 <button className="qty-btn" onClick={decrease}>-</button>
                 <span className="qty-value">{quantity}</span>
                 <button className="qty-btn" onClick={increase}>+ </button>
                </div>
                </div>
                <h5>Description</h5>
                <p>
                  {product?.description}
                </p>
                <div className="update-delete">
                  <button className="custom_btn"  onClick={handleAddToCart}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BuyerProductDetails;
