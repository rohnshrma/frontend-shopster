import ViewProduct from "../component/viewproduct";
import Layout from "../component/layout";

const ProductDetails = ()=>{
    return (
         <Layout>
            <section className="innercontent">
            <h1>Product Details</h1>
            <ViewProduct />
            </section>

         </Layout> 
    )
}
export default ProductDetails;