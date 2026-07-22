import "../App.css";

const Search_filter = ({searchHandler})=>{
    return (
        <section className="search_filter">
            <form>
                <div className="form-group position-relative">
                     <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" className="form-control" name="search" placeholder="Search product..." onChange={searchHandler} />
                </div>
                  <div className="form-group">
                    <i className="fa-solid fa-filter search-icon"></i>
                   <select className="form-control" onChange={searchHandler} name="filter">
                    <option value=""> Filter by Category..</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Books">Books</option>
                   </select>
                </div>
            </form>
        </section>
    )
}

export default Search_filter;