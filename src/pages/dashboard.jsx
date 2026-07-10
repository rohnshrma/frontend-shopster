import "../App.css"
import Layout from "../component/layout"
import Statistics from "../component/statistics"
import ProductList from "../component/productlist"
import { useProductContext } from "../context/productContextCore"


const Dashboard = ()=>{
    const {productData} = useProductContext();
    return (
         <Layout>
            <section className="innercontent">
            <h1>Dashboard</h1>
            <Statistics />
            <ProductList showtitle = {true} productsData={productData} />
            </section>

         </Layout>       
    )
}

export default Dashboard
