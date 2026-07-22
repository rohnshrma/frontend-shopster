import "../../App.css";
import dummypro from "../../assets/images/dummyproducts.webp";
import BuyerHeader from "../../component/buyers/buyer-header";
import Footer from "../../component/buyers/footer";
import { useState } from "react";
import { useProductContext } from "../../context/productContextCore";
import { useParams, useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/cartContextCore";

const BuyerProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const { productData, loading } = useProductContext();
  const { id } = useParams();

  const product = productData.find(
    (item) => item._id === id || item.id === id
  );

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (!localStorage.getItem("buyerToken")) {
      alert("Please login to add items to cart");
      navigate("/buyers/login");
      return;
    }
    addToCart({
      ...product,
      _id: product._id || product.id,
      quantity,
    });
    navigate("/cart");
  };

  if (loading) {
    return (
      <>
        <BuyerHeader />
        <section className="productdetails">
          <div className="container">
            <p>Loading product...</p>
          </div>
        </section>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <BuyerHeader />
        <section className="productdetails">
          <div className="container">
            <p>Product not found.</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <BuyerHeader />
      <section className="productdetails">
        <div className="container">
          <div className="row ">
            <div className="col-lg-5">
              <img
                src={dummypro}
                alt={product.name}
                className="img-fluid w-100"
              />
            </div>
            <div className="col-lg-5 col-md-7">
              <div className="proinfo">
                <h3>{product.name}</h3>
                <ul>
                  <li>
                    <b>Category:</b> <p>{product.category}</p>
                  </li>
                  <li>
                    <b>Price:</b> <p>₹ {product.price}</p>
                  </li>
                </ul>
                <div className="quantity-box">
                  <label>Quantity</label>
                  <div className="quantity-control">
                    <button className="qty-btn" onClick={decrease}>
                      -
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button className="qty-btn" onClick={increase}>
                      +
                    </button>
                  </div>
                </div>
                <h5>Description</h5>
                <p>{product.description}</p>
                <div className="update-delete">
                  <button className="custom_btn" onClick={handleAddToCart}>
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
