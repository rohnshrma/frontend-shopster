import "../App.css"
import { useNavigate } from "react-router-dom"
const Header = ()=>{
    const navigate = useNavigate();
    const handleLogout = ()=>{
     localStorage.removeItem("token");
     navigate("/login");
    }
    return(
        <header>
            <button onClick={handleLogout}><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        </header>
    )
}

export default Header