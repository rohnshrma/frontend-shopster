import "../App.css";
import { useReducer } from "react";
import { useProductContext } from "../context/productcontext";
import {v4 as uuidv4} from "uuid";

  const initialState = {
    name:"",
    category:"",
    price:"",
    description:""
  }
  const formReducer = (state , action) =>{
   if(action.type === "RESET"){
   return initialState ;
   }
   return {
    ...state ,
    [action.type] : action.payload
   }
   
  }


const ProductForm = () => {

 const {ProductHandler} = useProductContext(); 
 const [ProData , dispatch] = useReducer(formReducer , initialState)
 
 const formHandler = (e)=>{
  const {name , value} = e.target;
  dispatch({type:name , payload:value});
 }
 const SubmitHandler = (e)=>{
  e.preventDefault();
  const products = {
    id : uuidv4(),
    ...ProData
  }
  ProductHandler(products);
  console.log("this is my data " , products)
  dispatch({type:"RESET"})
  return initialState;
 }

  return (
    <section className="productform">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <form onSubmit={SubmitHandler}>
              <div class="twocolumns">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Product Name.." name="name" className="form-control" value={ProData.name} onChange={formHandler}></input>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" name="category" value={ProData.category} onChange={formHandler}>
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Books">Books</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" placeholder="Enter price" name="price" className="form-control" value={ProData.price} onChange={formHandler}></input>
              </div>
              <div className="form-group forimage">
                <label>Product Image</label>

                <label className="image-upload">
                  <input type="file" name="image" accept="image/*" hidden />
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <p>Drop your image here</p>
                  <span>or click to browse</span>
                </label>
              </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" name="description" placeholder="Enter product description" value={ProData.description} onChange={formHandler}></textarea>
              </div>
              <div className="addpro">
                <button className="custom_btn">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const UpdateForm = ()=>{
   return (
    <section className="productform">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <form>
              <div class="twocolumns">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Product Name.."
                  name="name"
                  className="form-control"
                ></input>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" name="category">
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Books">Books</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  name="price"
                  className="form-control"
                ></input>
              </div>
              <div className="form-group forimage">
                <label>Product Image</label>

                <label className="image-upload">
                  <input type="file" name="image" accept="image/*" hidden />
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <p>Drop your image here</p>
                  <span>or click to browse</span>
                </label>
              </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" name="description" placeholder="Enter product description"></textarea>
              </div>
              <div className="addpro">
                <button className="custom_btn">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
export default ProductForm;
export {UpdateForm};