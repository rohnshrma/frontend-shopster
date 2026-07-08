import ProductForm from "../component/productform";
import Layout from "../component/layout";


const AddProduct = ()=>{
    return (
           <Layout>
            <section className="innercontent">
                <h1>Add Product</h1>
            <ProductForm />
            </section>
         </Layout> 
    )
}

export default AddProduct;