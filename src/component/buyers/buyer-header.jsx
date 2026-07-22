import logo from "../../assets/images/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { useBuyerProfileContext } from "../../context/buyerProfileContextCore";
import { useCartContext } from "../../context/cartContextCore";

const BuyerHeader = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const { buyerProfile, setBuyerProfile } = useBuyerProfileContext();
  const { cartItems } = useCartContext();
  const isLoggedIn = !!localStorage.getItem("buyerToken");

  const logoutHandler = () => {
    localStorage.removeItem("buyerToken");
    setBuyerProfile(null);
    navigate("/buyers/login");
  };

  return (
    <section className="webheader">
      <Link to="/shop">
        <img src={logo} alt="Shopster logo" className="logo" />
      </Link>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group position-relative">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search product with name..."
            name="search"
            className="form-control"
            value={search || ""}
            onChange={(e) => setSearch && setSearch(e.target.value)}
          />
        </div>
      </form>
      <nav>
        <Link to="/shop">
          <i className="fa-solid fa-house-user"></i> Home
        </Link>
        <Link to="/cart">
          <i className="fa-solid fa-cart-arrow-down"></i>
          Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </Link>
        {isLoggedIn && (
          <Link to="/buyers/profile">
            <i className="fa-regular fa-circle-user"></i>
            {buyerProfile?.username || "Profile"}
          </Link>
        )}
        {isLoggedIn ? (
          <span onClick={logoutHandler} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Logout
          </span>
        ) : (
          <Link to="/buyers/login" className="login-link">
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            Login
          </Link>
        )}
      </nav>
    </section>
  );
};

export default BuyerHeader;
