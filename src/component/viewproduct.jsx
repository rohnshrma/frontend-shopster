import "../App.css";
import dummypro from "../assets/images/dummyproducts.webp";
import { useProductContext } from "../context/productcontext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ViewProduct = ()=>{
const navigate = useNavigate();
const {id} = useParams();
const {productData , DeleteHandler} = useProductContext();
const handleDelete = ()=>{
    DeleteHandler(id);
    navigate("/products");
}
const product = productData.find((item) => item.id == id)
    return(
        <section className="productdetails">
            <div className="container">
                <div className="row ">
                    <div className="col-lg-5">
                        <img src={dummypro} alt="product image" className="img-fluid w-100" />
                    </div>
                    <div className="col-lg-5 col-md-7">
                        <div className="proinfo">
                            <h3>{product?.name}</h3>
                            <ul>
                                <li><b>Category:</b> <p>{product?.category}</p></li>
                                <li><b>Price:</b> <p>{product?.price}</p></li>
                            </ul>
                            <h5>Description</h5>
                            <p>{product?.description}</p>
                            <div className="update-delete">
                                <button type="submit" className="custom_btn">Update</button>
                                <button type="submit" className="custom_btn deletebtn" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ViewProduct;