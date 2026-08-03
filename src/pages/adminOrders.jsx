import { useState , useEffect} from "react";
import "../App.css";
import Layout from "../component/layout";
import {  FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";


const AdminOrder = () => {

  const navigate = useNavigate()
  const getBadge = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Confirmed":
        return "info";
      case "Shipped":
        return "primary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const [orders, setOrders]= useState([])
  const [loading , setLoading] = useState(true)

  useEffect(()=>{
  const fetchOrder = async()=>{
    try{
    const response = await API("/admin/orders", {
      method : "GET",
      tokenType : "admin",
    })
    console.log("admin order" , response)
    setOrders(response.data)
    }
    catch(err){
      console.log("failed to get admin order details", err)
      alert(`${err.message}, failed to get order`)
    }finally{
      setLoading(false)
    }
  }
  fetchOrder()
  },[])
 const [search, setSearch] = useState("");
const [filter, setFilter] = useState("");

const filterOrder = orders.filter((order) => {
  const searchText = search.toLowerCase();

  const matchSearch =
    order._id?.toLowerCase().includes(searchText) ||
    order.buyer?.username?.toLowerCase().includes(searchText) ||
    order.buyer?.email?.toLowerCase().includes(searchText);

  const matchFilter =
    filter === "" || order.status === filter;

  return matchSearch && matchFilter;
});
 
  return (
    <Layout>
      <section className="innercontent ">
        

        <div className="container-fluid py-4">
          {/* Heading */}

          
          <div className="mb-4">
            <h2 className="fw-bold">Orders</h2>
            <p className="text-muted">Manage all customer orders</p>
          </div>

           {orders.length === 0 ? (
            <p>No order Found</p>
           ): <div>
            {/* Search */}

            <div className="search_filter">
            <form>
                <div className="form-group position-relative">
                     <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" className="form-control" name="search" placeholder="Search by Order Id or buyer..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                </div>
                  <div className="form-group">
                    <i className="fa-solid fa-filter search-icon"></i>
                   <select className="form-control" name="filter" value={filter} onChange={(e)=>setFilter(e.target.value)}>
                    <option value=""> Filter by status..</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                   </select>
                </div>
            </form>
        </div>

          {/* Table */}
          

          {loading ? (
            <p className="text-center py-5">Loading orders...</p>
          ):(
            <div className="card border-0 shadow-sm rounded-4 admin_order">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Buyer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filterOrder.map((order) => (
                    <tr key={order._id} >
                      <td>{order._id}</td>

                      <td>{order.buyer?.username || order.buyer?.email ||  "Unknown"}</td>

                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                      <td>₹{order.totalAmount}</td>

                      <td>
                        <span className={`badge bg-${getBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="text-center">
                        <button className="btn btn-light border"  onClick={() => navigate(`/admin/orders/${order._id}`)}>
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
           </div>}

        
        </div>
      </section>
    </Layout>
  );
};

export default AdminOrder;
