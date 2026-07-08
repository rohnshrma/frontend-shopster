import "../App.css"
import Layout from "../component/layout"
import ProductList from "../component/productlist"
import Search_filter from "../component/search-filter"
import { useProductContext } from "../context/productcontext"


const AllProducts = ()=>{
    const  {productData} = useProductContext();
    return (
         <Layout>
            <section className="innercontent">
            <div className="listingtitle">
           <h1>All Products</h1>
           <a href="/addproduct" className="custom_btn">+ Add Products</a>
            </div>
           <Search_filter />
            <ProductList showtitle = {false} productsData = {productData}/>
            </section>

         </Layout>       
    )
}

export default AllProducts