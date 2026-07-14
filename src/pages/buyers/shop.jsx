import "../../App.css";
import BuyerHeader from "../../component/buyers/buyer-header";
import Banner from "../../assets/images/banner.webp"
import Shopcards from "../../component/buyers/shop-card";
import Footer from "../../component/buyers/footer";
import { useProductContext } from "../../context/productContextCore";
import { useState } from "react";

const Shop = ()=>{
    const {productData} = useProductContext();
    const [search, setSearch] = useState("");
    const filterProducts = productData.filter((item) =>
  item.name.toLowerCase().includes(search.toLowerCase())
);
    return(
        <>
        <BuyerHeader  search={search} setSearch={setSearch}/>
        <section className="banner">
            <img src={Banner} alt="images" className="bannerimg img-fluid " /> 
        </section>
        <section className="shoplist">
            <div className="container">
                <h3>Best Sellers</h3>
             <div className="shop-row">
                <Shopcards products={filterProducts}/>
             </div>
            </div>
        </section>
        <Footer />
        </>
    )
}

export default Shop;