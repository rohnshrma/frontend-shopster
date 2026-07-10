import { useState } from "react"
import "../App.css"
import Layout from "../component/layout"
import ProductList from "../component/productlist"
import Search_filter from "../component/search-filter"
import { useProductContext } from "../context/productContextCore"


const AllProducts = ()=>{
    const  {productData} = useProductContext();
    
    const [searchData , setSearchData] =useState ({
    search:"",
    filter:""
    })
    
    const SearchHandlers = (e)=>{
        const {name ,value} = e.target;
        setSearchData((prevData)=>{return{...prevData , [name]:value.toLowerCase()}});
    }
    const allproduct = productData.filter((products)=>{
        const matchSearch = products.name.toLowerCase().includes(searchData.search);
        const matchFilter = searchData.filter ? products.category.toLowerCase().includes(searchData.filter):true
    return  matchSearch && matchFilter;
    })

   
    return (
         <Layout>
            <section className="innercontent">
            <div className="listingtitle">
           <h1>All Products</h1>
           <a href="/addproduct" className="custom_btn">+ Add Products</a>
            </div>
           <Search_filter searchHandler ={SearchHandlers} />
            <ProductList showtitle = {false} productsData = {allproduct}/>
            </section>

         </Layout>       
    )
}

export default AllProducts
