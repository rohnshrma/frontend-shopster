import "../../App.css";
import BuyerHeader from "../../component/buyers/buyer-header";
import Banner from "../../assets/images/banner.webp";
import Shopcards from "../../component/buyers/shop-card";
import Footer from "../../component/buyers/footer";
import { useProductContext } from "../../context/productContextCore";
import { useState } from "react";

const Shop = () => {
  const { productData, loading, error } = useProductContext();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filterProducts = productData.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory = category
      ? item.category === category
      : true;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <BuyerHeader search={search} setSearch={setSearch} />
      <section className="banner">
        <img src={Banner} alt="Shopster banner" className="bannerimg img-fluid" />
      </section>
      <section className="shoplist">
        <div className="container">
          <div className="shop-filter-row">
            <h3>Best Sellers</h3>
            <div className="category-filter">
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Books">Books</option>
              </select>
            </div>
          </div>
          {loading && <p className="shop-status">Loading products...</p>}
          {error && <p className="shop-status shop-error">{error}</p>}
          {!loading && !error && filterProducts.length === 0 && (
            <p className="shop-status">No products found.</p>
          )}
          {!loading && filterProducts.length > 0 && (
            <div className="shop-row">
              <Shopcards products={filterProducts} />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Shop;