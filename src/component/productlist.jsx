import "../App.css";
import dummypro from "../assets/images/dummyproducts.webp"

const ProductList = ({showtitle =  true , productsData})=>{
    return (
        <section className="productlist">
            {showtitle && (
            <div className="prolist-title">
               <h4>Recent Orders</h4>
               <a href="/products">View All</a>
            </div>
            )}
            
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Order ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {productsData.map((proD)=>{
                        return (
                      <tr key = {proD.id}>
                       <td><img src={dummypro} alt="product image" className="img-fluid"/></td>
                        <td>{proD.id}</td>
                        <td>{proD.name}</td>
                        <td>{proD.category}</td>
                        <td className="price">{proD.price}</td>
                        <td><a href={`/productsdetails/${proD.id}`}>View</a></td>
                     </tr>
                        )
                    })}
                  
                     {/* <tr>
                        <td><img src={dummypro} alt="product image" className="img-fluid"/></td>
                        <td>#239230</td>
                        <td>Iphone</td>
                        <td>Electronic</td>
                        <td className="price">65,000</td>
                        <td><button>View</button></td>
                    </tr>
                      <tr>
                        <td><img src={dummypro} alt="product image" className="img-fluid"/></td>
                        <td>#239230</td>
                        <td>Iphone</td>
                        <td>Electronic</td>
                        <td className="price">65,000</td>
                        <td><button>View</button></td>
                    </tr>
                      <tr>
                        <td><img src={dummypro} alt="product image" className="img-fluid"/></td>
                        <td>#239230</td>
                        <td>Iphone</td>
                        <td>Electronic</td>
                        <td className="price">65,000</td>
                        <td><button>View</button></td>
                    </tr>
                      <tr>
                        <td><img src={dummypro} alt="product image" className="img-fluid"/></td>
                        <td>#239230</td>
                        <td>Iphone</td>
                        <td>Electronic</td>
                        <td className="price">65,000</td>
                        <td><button>View</button></td>
                    </tr> */}

                </tbody>
            </table>
             
        </section>
    )
}

export default ProductList;