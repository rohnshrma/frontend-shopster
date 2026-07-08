import { UpdateForm } from "../component/productform";
import Layout from "../component/layout";

const UpdateProduct = ()=>{
    return (
          <Layout>
            <section className="innercontent">
                <h1>Update Product</h1>
            <UpdateForm />
            </section>
         </Layout> 
    )
}
export default UpdateProduct;