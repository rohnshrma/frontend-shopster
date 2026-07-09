import "../App.css";
import dummypro from "../assets/images/dummyproducts.webp";

const ProductList = ({ showtitle = true, productsData }) => {
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
          {productsData.map((proD) => {
             const colorHandler = () => {
              return {
                backgroundColor:
                  proD.category === "Electronics"
                    ? "rgba(128, 0, 128, 0.227)"
                    : proD.category === "Fashion"
                      ? "rgba(255, 166, 0, 0.184)"
                      : "rgba(0, 128, 0, 0.205)",
                color:
                  proD.category === "Electronics"
                    ? "purple"
                    : proD.category === "Fashion"
                      ? "orangered"
                      : "green",
              };
            };
              return (
              <tr key={proD.id}>
                <td>
                  <img
                    src={dummypro}
                    alt="product image"
                    className="img-fluid"
                  />
                </td>
                <td>{proD.id}</td>
                <td>{proD.name}</td>
                <td>
                  <span style={colorHandler()} className="category">
                    {proD.category}
                  </span>
                </td>
                <td className="price">{proD.price}</td>
                <td>
                  <a href={`/productsdetails/${proD.id}`}>View</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default ProductList;
