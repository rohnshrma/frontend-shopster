import "../App.css"

const Sidebar = ()=>{
    return(
       <section className="sidebar">
        <div className="logo">
            <a href="/"><i class="fa-brands fa-shopware"></i> E-Shop Admin</a>
        </div>
        <ul>
            <li className="active"><a href="/"> <i class="fa-solid fa-house"></i> Dashboard</a></li>
            <li><a href="/products"><i class="fa-solid fa-box"></i> Products</a></li>
            <li><a href="#"><i class="fa-solid fa-cart-arrow-down"></i> Order</a></li>
            <li><a href="#"><i class="fa-solid fa-inbox"></i> Categories</a></li>
            <li><a href="#"><i class="fa-solid fa-users"></i> Customers</a></li>
            <li><a href="#"><i class="fa-solid fa-chart-area"></i> Reports</a></li>
            <li><a href="#"><i class="fa-solid fa-gear"></i> Setting</a></li>
            <li><a href="#"><i class="fa-solid fa-arrow-right-from-bracket"></i>Logout</a></li>            
        </ul>
       </section>
    )
}

export default Sidebar