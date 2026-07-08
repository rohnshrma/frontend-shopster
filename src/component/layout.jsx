import Header from "./header";
import Sidebar from "./sidebar";


const Layout = ({children})=>{
    return(
        <section className="fullpage">
        <Sidebar />
         <main>
            <Header />
            {children}
         </main>
        
        </section>
    )
}

export default Layout