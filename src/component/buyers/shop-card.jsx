import { Link } from "react-router-dom";
import "../../App.css";
import dummyshop from "../../assets/images/dummyproducts.webp";

const Shopcards = ({ products }) => {
  return (
    <>
      {products.map((items) => {
        return (
          <div className="shopcard" key={items._id}>
            <figure>
              <img src={dummyshop} alt="shop img" />
            </figure>
            <h4>{items.name}</h4>
            <span className="shop-categ">{items.category}</span>
            <h5>
              ₹ {items.price} <span>40% off</span>
            </h5>
            <Link to={`/shop/productdetails/${items._id}`}></Link>
          </div>
        );
      })}
    </>
  );
};

export default Shopcards;
