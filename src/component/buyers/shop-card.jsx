import { Link } from "react-router-dom";
import "../../App.css";
import dummyshop from "../../assets/images/dummyproducts.webp";

const Shopcards = ({ products }) => {
  return (
    <>
      {products.map((item) => {
        const productId = item._id || item.id;
        return (
          <div className="shopcard" key={productId}>
            <figure>
              <img src={dummyshop} alt={item.name} />
            </figure>
            <h4>{item.name}</h4>
            <span className="shop-categ">{item.category}</span>
            <h5>₹ {item.price}</h5>
            <Link to={`/shop/productdetails/${productId}`}></Link>
          </div>
        );
      })}
    </>
  );
};

export default Shopcards;
