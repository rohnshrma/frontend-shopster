import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <section className="sidebar">
      <div className="logo">
        <a href="/">
          <i className="fa-brands fa-shopware"></i> E-Shop Admin
        </a>
      </div>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-solid fa-house"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-solid fa-box"></i> Products
          </NavLink>
        </li>
        <li>
          <a href="#">
            <i className="fa-solid fa-cart-arrow-down"></i> Order
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa-solid fa-inbox"></i> Categories
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa-solid fa-users"></i> Customers
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa-solid fa-chart-area"></i> Reports
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa-solid fa-gear"></i> Setting
          </a>
        </li>
        <li onClick={handleLogout}>
          <a href="#">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Logout
          </a>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;