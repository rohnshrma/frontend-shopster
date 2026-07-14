import logo from "../../assets/images/logo.webp";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useBuyerProfileContext } from "../../context/BuyerProfileContext";

const BuyerHeader = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const { setBuyerProfile } = useBuyerProfileContext();
  const logoutHandler = () => {
    localStorage.removeItem("buyerToken");
    setBuyerProfile(null);
    navigate("/buyers/login");
  };
  return (
    <section className="webheader">
      <Link to="/shop">
        <img src={logo} alt="logo image" className="logo" />
      </Link>
      <form>
        <div className="form-group position-relative">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search product with name..."
            name="search"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
      <nav>
        <Link to="/shop">
          <i className="fa-solid fa-house-user"></i> Home
        </Link>
        <Link to="/cart">
          <i className="fa-solid fa-cart-arrow-down"></i>Cart
        </Link>
        <Link to="/buyers/profile">
          <i className="fa-regular fa-circle-user"></i> Profile
        </Link>
        <span onClick={logoutHandler} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-arrow-right-to-bracket"></i>Login/ Logout
        </span>
      </nav>
    </section>
  );
};

export default BuyerHeader;
